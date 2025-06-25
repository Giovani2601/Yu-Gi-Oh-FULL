const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logActivity = require('../middlewares/logger');

exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'O campo nome é obrigatório.' });
    }
    if (!email) {
      return res.status(400).json({ erro: 'O campo email é obrigatório.' });
    }
    if (!senha) {
      return res.status(400).json({ erro: 'O campo senha é obrigatório.' });
    }

    const jaExiste = await User.findOne({ email });
    if (jaExiste) {
      logActivity('REGISTER-ERROR', `Erro ao tentar registrar email em utilização: ${email}`, req);
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    const novoUsuario = new User({ nome, email, senha });
    await novoUsuario.save();

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });
    logActivity('REGISTER-SUCCESS', `Registro bem-sucedido para o email: ${email}`, req);
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    logActivity('REGISTER-ERROR', `Erro interno no registro para ${req.body.email || 'email não fornecido'}: ${err.message}`, req);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.', detalhes: err.message });
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email) {
      return res.status(400).json({ erro: 'O campo email é obrigatório.' });
    }
    if (!senha) {
      return res.status(400).json({ erro: 'O campo senha é obrigatório.' });
    }

    const usuario = await User.findOne({ email });
    if (!usuario) {
      logActivity('LOGIN-ERROR', `Tentativa de login com email inexistente: ${email}`, req);
      return res.status(401).json({ erro: 'Email não encontrado.' });
    }

    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      logActivity('LOGIN-ERROR', `Tentativa de login com senha incorreta para o email: ${email}`, req);
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    logActivity('LOGIN-SUCCESS', `Login bem-sucedido para o email: ${email}`, req);

    const token = jwt.sign(
      { id: usuario._id, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      mensagem: 'Login bem-sucedido!',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    logActivity('LOGIN-ERROR', `Erro interno no login para ${req.body.email || 'email não fornecido'}: ${err.message}`, req);
    res.status(500).json({ erro: 'Erro ao fazer login.', detalhes: err.message });
  }
};