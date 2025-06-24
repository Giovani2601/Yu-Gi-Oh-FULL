// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('./models/User');
const Card = require('./models/Card');

async function runSeed() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/yugioh',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log('🔗 Conectado ao MongoDB');

    await Usuario.deleteMany({});
    await Card.deleteMany({});
    console.log('🧹 Coleções limpas');

    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedUser = await bcrypt.hash('yugi123', 10);
    await Usuario.insertMany([
      { nome: 'Admin', email: 'admin@admin.com.br', senha: hashedAdmin },
      { nome: 'Yugi', email: 'yugi@yugi.com.br', senha: hashedUser }
    ]);
    console.log('👤 Usuários inseridos');

    const cards = [
      {
        nome: 'Dark Magician',
        tipo: 'monstro',
        descricao: 'O maior mago em termos de ataque e defesa.',
        imagem: 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
        nivel: 7,
        ataque: 2500,
        defesa: 2100
      },
      {
        nome: 'Blue-Eyes White Dragon',
        tipo: 'monstro',
        descricao: 'Este lendário dragão é um motor de destruição poderosa.',
        imagem: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
        nivel: 8,
        ataque: 3000,
        defesa: 2500
      },
      {
        nome: 'Red-Eyes Black Dragon',
        tipo: 'monstro',
        descricao: 'Um dragão com aspirações de se tornar ainda mais forte.',
        imagem: 'https://images.ygoprodeck.com/images/cards/74677422.jpg',
        nivel: 7,
        ataque: 2400,
        defesa: 2000
      },
      {
        nome: 'Exodia the Forbidden One',
        tipo: 'monstro',
        descricao: 'Se as cinco cartas de Exodia estiverem na mão, você vence o duelo.',
        imagem: 'https://images.ygoprodeck.com/images/cards/33396948.jpg',
        nivel: 3,
        ataque: 1000,
        defesa: 1000
      },
      {
        nome: 'Summoned Skull',
        tipo: 'monstro',
        descricao: 'Um demônio invocado com grande poder de ataque.',
        imagem: 'https://images.ygoprodeck.com/images/cards/70781052.jpg',
        nivel: 6,
        ataque: 2500,
        defesa: 1200
      },
      {
        nome: 'Kuriboh',
        tipo: 'monstro',
        descricao: 'Uma pequena criatura que pode salvar você de danos letais.',
        imagem: 'https://images.ygoprodeck.com/images/cards/40640057.jpg',
        nivel: 1,
        ataque: 300,
        defesa: 200
      },
      {
        nome: 'Gaia The Fierce Knight',
        tipo: 'monstro',
        descricao: 'Um guerreiro montado em um cavalo poderoso.',
        imagem: 'https://images.ygoprodeck.com/images/cards/6368038.jpg',
        nivel: 7,
        ataque: 2300,
        defesa: 2100
      },
      {
        nome: 'Dark Magician Girl',
        tipo: 'monstro',
        descricao: 'Companheira do Dark Magician, com grande poder mágico.',
        imagem: 'https://images.ygoprodeck.com/images/cards/38033121.jpg',
        nivel: 6,
        ataque: 2000,
        defesa: 1700
      },
      {
        nome: 'Black Luster Soldier',
        tipo: 'monstro',
        descricao: 'Um guerreiro com poder de banir qualquer criatura.',
        imagem: 'https://images.ygoprodeck.com/images/cards/38517737.jpg',
        nivel: 8,
        ataque: 3000,
        defesa: 2500
      },
      {
        nome: 'Slifer the Sky Dragon',
        tipo: 'monstro',
        descricao: 'Um dos três dragões divinos do céu.',
        imagem: 'https://images.ygoprodeck.com/images/cards/10000020.jpg',
        nivel: 10,
        ataque: 0,
        defesa: 0
      },
      {
        nome: 'Monster Reborn',
        tipo: 'feitico',
        descricao: 'Revive um monstro no campo.',
        imagem: 'https://images.ygoprodeck.com/images/cards/83764718.jpg'
      },
      {
        nome: 'Raigeki',
        tipo: 'feitico',
        descricao: 'Destrua todos os monstros do oponente.',
        imagem: 'https://images.ygoprodeck.com/images/cards/12580477.jpg'
      },
      {
        nome: 'Change of Heart',
        tipo: 'feitico',
        descricao: 'Tome controle de um monstro do oponente até o final do turno.',
        imagem: 'https://images.ygoprodeck.com/images/cards/44519536.jpg'
      },
      {
        nome: 'Swords of Revealing Light',
        tipo: 'feitico',
        descricao: 'Oponente não pode atacar por 3 turnos.',
        imagem: 'https://images.ygoprodeck.com/images/cards/81439173.jpg'
      },
      {
        nome: 'Pot of Greed',
        tipo: 'feitico',
        descricao: 'Compre 2 cartas.',
        imagem: 'https://images.ygoprodeck.com/images/cards/55144522.jpg'
      },
      {
        nome: 'Graceful Charity',
        tipo: 'feitico',
        descricao: 'Compre 3 cartas e descarte 2.',
        imagem: 'https://images.ygoprodeck.com/images/cards/79571449.jpg'
      },
      {
        nome: "Harpie's Feather Duster",
        tipo: 'feitico',
        descricao: 'Destrua todas as armadilhas e magias do oponente.',
        imagem: 'https://images.ygoprodeck.com/images/cards/18144506.jpg'
      },
      {
        nome: 'Dark Hole',
        tipo: 'feitico',
        descricao: 'Destrua todos os monstros no campo.',
        imagem: 'https://images.ygoprodeck.com/images/cards/53129443.jpg'
      }
    ];

    await Card.insertMany(cards);
    console.log(`🎴 Inseridos ${cards.length} cards`);

  } catch (error) {
    console.error('❌ Erro ao rodar seed:', error);
  } finally {
    mongoose.connection.close();
  }
}

runSeed();
