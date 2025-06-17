const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Cadastro
exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação de unicidade do email
    const jaExiste = await User.findOne({ email });
    if (jaExiste) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const novoUsuario = new User({ nome, email, senha });
    await novoUsuario.save();

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
  }
};

// Login
exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(401).json({ erro: 'Email não encontrado' });

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta' });

    // Geração do token JWT
    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      mensagem: 'Login bem-sucedido',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login', detalhes: err.message });
  }
};