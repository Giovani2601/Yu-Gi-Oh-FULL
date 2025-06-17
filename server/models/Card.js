const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  tipo: {
    type: String,
    enum: ['monstro', 'feitico'],
    required: true
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  nivel: {
    type: Number,
    min: 1,
    max: 12,
    required: function () {
      return this.tipo === 'monstro';
    }
  },
  ataque: {
    type: Number,
    min: 0,
    max: 9999,
    required: function () {
      return this.tipo === 'monstro';
    }
  },
  defesa: {
    type: Number,
    min: 0,
    max: 9999,
    required: function () {
      return this.tipo === 'monstro';
    }
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);
