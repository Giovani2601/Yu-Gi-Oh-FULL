const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const autenticar = require('../middlewares/auth');

// Rotas com 'autenticar' são protegidas por autenticação JWT
router.get('/', autenticar, cardController.getCards);
router.post('/', autenticar, cardController.createCard);

module.exports = router;
