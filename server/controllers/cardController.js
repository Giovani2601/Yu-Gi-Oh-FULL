const Card = require('../models/Card');
const logActivity = require('../middlewares/logger');
const cache = require('../utils/cache');

// Cria array de pares [chave, valor], ordenado alfabeticamente por chave
function getCacheKeyForGetCards(query) {
  const keys = Object.keys(query).sort();
  const parts = keys.map(k => `${k}:${query[k]}`);
  const key = 'cards' + parts.join('|');
  return key;
}

exports.getCards = async (req, res) => {
  try {
    const cacheKey = getCacheKeyForGetCards(req.query);

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      logActivity('CACHE-HIT', `Retornando cards do cache para chave '${cacheKey}'`, req);
      return res.json(cachedData);
    }

    // Cache MISS, busca no banco de dados
    const { tipo, nome } = req.query;
    let filtro = {};

    if (tipo) filtro.tipo = tipo;
    if (nome) filtro.nome = new RegExp(nome, 'i');

    const cards = await Card.find(filtro);

    cache.set(cacheKey, cards);
    logActivity('CACHE-SET', `Salvando cards no cache para chave '${cacheKey}', total ${cards.length}`, req);

    res.json(cards);
  } catch (err) {
    console.error('Erro ao buscar cartas:', err);
    logActivity('CARD-FETCH-ERROR', `Erro ao buscar cards com filtro '${JSON.stringify(req.query)}': ${err.message}`, req);
    res.status(500).json({ erro: 'Erro ao buscar cartas.', detalhes: err.message });
  }
};

exports.createCard = async (req, res) => {
  try {
    const dadosCard = req.body;

    if (!dadosCard.nome) {
      logActivity('CARD-CREATE-VALIDATION-ERROR', 'Tentativa de criar card sem nome.', req);
      return res.status(400).json({ erro: 'O campo nome do card é obrigatório.' });
    }
    if (!dadosCard.tipo) {
      logActivity('CARD-CREATE-VALIDATION-ERROR', `Tentativa de criar card '${dadosCard.nome}' sem tipo.`, req);
      return res.status(400).json({ erro: 'O campo tipo do card é obrigatório.' });
    }

    const novoCard = new Card(dadosCard);
    await novoCard.save(); 

    logActivity('CARD-CREATED', `Card '${novoCard.nome}' (ID: ${novoCard._id}) criado com sucesso.`, req);

    // Invalida caches relacionados a GET /cards:
    const keys = cache.keys();
    const keysToDelete = keys.filter(key => key.startsWith('cards'));
    if (keysToDelete.length > 0) {
      cache.del(keysToDelete);
      logActivity('CACHE-INVALIDATE', `Invalidando cache de cards após criação: chaves removidas ${keysToDelete.join(',')}`, req);
    }

    res.status(201).json(novoCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const erros = Object.values(err.errors).map(el => ({
        campo: el.path,
        mensagem: el.message,
      }));
      logActivity('CARD-CREATE-VALIDATION-ERROR', `Falha na validação ao criar card '${req.body.nome || 'Nome não fornecido'}': ${JSON.stringify(erros)}`, req);
      return res.status(400).json({ erro: 'Dados inválidos para criar o card.', detalhes: erros });
    }
    console.error('Erro ao criar carta:', err);
    logActivity('CARD-CREATE-ERROR', `Erro ao criar card '${req.body.nome || 'Nome não fornecido'}': ${err.message}`, req);
    res.status(500).json({ erro: 'Erro ao criar carta.', detalhes: err.message });
  }
};
