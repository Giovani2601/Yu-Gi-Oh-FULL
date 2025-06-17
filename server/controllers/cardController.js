const Card = require('../models/Card');

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
    res.status(500).json({ erro: 'Erro ao buscar cartas', mensagem: err.message });
  }
};

// Cria um novo card
exports.createCard = async (req, res) => {
  try {
    const dados = req.body;
    const novoCard = new Card(dados);

    await novoCard.save();
    
    res.status(201).json(novoCard);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar carta', detalhes: err.message });
  }
};
