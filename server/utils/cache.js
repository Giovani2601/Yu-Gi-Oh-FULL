const NodeCache = require('node-cache');

// stdTTL: tempo padrão em segundos antes de expirar um item
// checkperiod: intervalo em segundos para checar chaves expiradas
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

module.exports = cache;
