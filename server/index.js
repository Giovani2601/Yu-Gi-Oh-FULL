const express = require('express');
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
require('dotenv').config();

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

const app = express();
const PORT = 4000;

connectDB();

// Define um máximo de requisições por IP para evitar abusos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, tente novamente mais tarde.'
});

app.use(express.json({ limit: '10kb' })); // Evita ataques DoS (sobrecarga) limitando a requisição
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBodyAndParams);

app.use(helmet()); // Adiciona cabeçalhos de segurança HTTP
app.use(cors());
app.use(sanitizeBody); // Aplica sanitização de corpo de requisição para evitar XSS em requisições JSON

app.use('/api/usuario', userRoutes);
app.use('/api/card', cardRoutes);

// Utiliza os certificados autoassinados SSL para HTTPS
const httpsOptions = {
  key: fs.readFileSync('./certificates/server.key'),
  cert: fs.readFileSync('./certificates/server.cert')
};

// Inicia o servidor HTTPS
https.createServer(httpsOptions, app).listen(4000, () => {
  console.log(`🔐 Servidor HTTPS rodando em https://localhost:${PORT}`);
});
