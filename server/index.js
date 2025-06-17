const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
require('dotenv').config();

const app = express();
const PORT = 4000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/usuario', userRoutes);
app.use('/api/card', cardRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
