const express = require('express');
const compression = require('compression');
const expressMongoSanitize = require('express-mongo-sanitize');
const fs = require('fs');
const https = require('https');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const sanitizeBody = require('./middlewares/sanitizer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para sanitizar corpo e parâmetros da requisição, pois a query estava dando erro
function sanitizeBodyAndParams(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    expressMongoSanitize.sanitize(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    expressMongoSanitize.sanitize(req.params);
  }
  // não chama o sanitize em req.query, para evitar reatribuição
  next();
}

connectDB();

app.use(compression());

// Máximo de requisições por IP para evitar abusos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, tente novamente mais tarde.'
});

app.use(limiter);
app.use(express.json({ limit: '10kb' })); // Evita ataques DoS (sobrecarga) limitando a requisição
app.use(express.urlencoded({ extended: true }));

app.use(helmet()); // Adiciona cabeçalhos de segurança HTTP
app.use(cors());
app.use(sanitizeBodyAndParams); // Aplica sanitização para evitar NoSQL injection

app.use('/api/usuario', userRoutes);
app.use('/api/card', cardRoutes);

// Serve arquivos estáticos da pasta build do React
app.use(express.static(path.join(__dirname, '../web/build')));

// Rota para servir o arquivo index.html do React
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../web/build', 'index.html'));
});

// Utiliza os certificados autoassinados SSL para HTTPS
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates/localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates/localhost.pem'))
};

// Inicia o servidor HTTPS
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`🔐 Servidor HTTPS rodando em https://localhost:${PORT}`);
});