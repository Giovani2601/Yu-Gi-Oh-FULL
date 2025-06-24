import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ModalWrapper from '../ui/ModalWrapper'; 

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !senha) {
      setError('Insira o seu email e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(email, senha);
      onClose(); 
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.erro || 'Erro no login.';
      setError(msg);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="cormorant-garamond-title text-4xl font-bold mb-6 text-center text-red-800">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-red-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            placeholder="insira seu email"
          />
        </div>
        <div>
          <label className="block text-red-700 mb-1">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            placeholder="Insira sua senha"
          />
        </div>
        {error && <p className="text-red-600 mb-4 text-center text-sm">{error}</p>}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-3 bg-red-800 text-white rounded-md hover:bg-red-900 flex items-center justify-center font-semibold transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
