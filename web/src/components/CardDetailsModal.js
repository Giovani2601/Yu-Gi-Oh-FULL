import React from 'react';
import { FaStar, FaShieldAlt } from 'react-icons/fa'; 
import { GiSwordsEmblem } from "react-icons/gi";

export default function CardDetailsModal({ card, onClose }) {
  if (!card) return null;

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-black p-6 rounded-lg shadow-xl max-w-4xl w-full relative text-white flex flex-col md:flex-row gap-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-3xl z-10"
        >
          &times;
        </button>

        {/* Coluna da Esquerda */}
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={card.imagem || '/assets/images/card-placeholder.png'} 
            alt={card.nome}
            className="w-full h-auto rounded-lg shadow-lg shadow-red-900/40"
          />
        </div>

        {/* Coluna da Direita */}
        <div className="md:w-2/3 flex flex-col">
          <h2 className="cormorant-garamond-title text-4xl font-bold text-white mb-2">{card.nome}</h2>
          
          <span
            className={`open-sans-text inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 self-start ${
              card.tipo === 'monstro' ? 'bg-yellow-600 text-yellow-100' : 'bg-purple-800 text-purple-100'
            }`}
          >
            {capitalize(card.tipo)}
          </span>

          <p className="open-sans-text text-gray-300 mb-6 flex-grow">{card.descricao}</p>

          {card.tipo === 'monstro' && (
            <div className="mt-auto pt-4 border-t border-x-red-50000">
              <div className="flex justify-around items-center text-center">
                <div className="flex flex-col items-center">
                  <FaStar className="text-yellow-400 text-2xl mb-1" />
                  <span className="font-bold text-lg">{card.nivel}</span>
                  <span className="text-md text-gray-400">Nível</span>
                </div>
                <div className="flex flex-col items-center">
                  <GiSwordsEmblem className="text-red-500 text-2xl mb-1" />
                  <span className="font-bold text-lg">{card.ataque}</span>
                  <span className="text-md text-gray-400">Ataque</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaShieldAlt className="text-blue-400 text-2xl mb-1" />
                  <span className="font-bold text-lg">{card.defesa}</span>
                  <span className="text-md text-gray-400">Defesa</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}