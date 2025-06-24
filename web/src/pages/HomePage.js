import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal, user } = useAuth();
  const handleStartClick = () => {
    if (isAuthenticated) navigate('/cards');
    else openLoginModal(() => navigate('/cards'));
  };

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-r from-red-900 to-black">
      <div className="flex flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row flex-1">
          {/* Coluna da esquerda */}
          <div className="flex-1 flex items-center justify-center bg-transparent">
            <div className="text-center md:text-left">
              <h1 className="cormorant-garamond-title text-4xl md:text-7xl font-bold text-white mb-4">
                Encontre seus <br/> cards favoritos!
              </h1>
              <p className="open-sans-text text-white text-xl mb-6 font">
                {isAuthenticated && user
                  ? `E aí, ${user.nome}! Que tal criar uns cards novos hoje?`
                  : 'Faça login para criar e explorar suas cartas favoritas.'}
              </p>
              <button
                onClick={handleStartClick}
                className="open-sans-text bg-red-950 hover:bg-red-900 text-white text-opacity-80 font-bold px-6 py-3 rounded"
              >
                {isAuthenticated ? 'Ver Cards' : 'Fazer Login'}
              </button>
            </div>
          </div>
          {/* Coluna da direita */}
          <div className="flex-1 flex items-center justify-center bg-transparent p-4">
            <div className="w-60 md:w-72 rounded-lg overflow-hidden shadow-2xl shadow-red-600/40
                           transition-transform duration-500 ease-in-out hover:scale-105">
              <img
                src="/assets/images/card.png"
                alt="Carta de Yu-Gi-Oh"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
