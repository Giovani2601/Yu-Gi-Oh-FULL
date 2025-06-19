const Card = require('../models/Card');
const logActivity = require('../middlewares/logger');

// Lista todos os cards ou filtra por tipo e/ou nome
exports.getCards = async (req, res) => {
  try {
    const { tipo, nome } = req.query;
    let filtro = {};

    if (tipo) filtro.tipo = tipo;
    if (nome) filtro.nome = new RegExp(nome, 'i');

    const cards = await Card.find(filtro);

    res.json(cards);
  } catch (err) {
    console.error('Erro ao buscar cartas:', err);
    logActivity('CARD-FETCH-ERROR', `Erro ao buscar cards com filtro '${JSON.stringify(req.query)}': ${err.message}`, req);
    res.status(500).json({ erro: 'Erro ao buscar cartas.', detalhes: err.message });
  }
};

// Cria um novo card
exports.createCard = async (req, res) => {
  try {
    const dadosCard = req.body;

    // Validação de campos obrigatórios básicos
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
