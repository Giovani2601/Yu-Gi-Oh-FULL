const jwt = require('jsonwebtoken');
const logActivity = require('./logger');

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logActivity('AUTH-ERROR', 'Token não fornecido', req);
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    logActivity('AUTH-SUCCESS', `Token verificado para usuário: ${payload.nome} (ID: ${payload.id})`, req);
    req.user = payload;
    next();
  } catch (err) {
    console.error('Erro na autenticação:', err);
    logActivity('AUTH-ERROR', `Token inválido ou expirado: ${err.message}`, req);
    res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = autenticar;
