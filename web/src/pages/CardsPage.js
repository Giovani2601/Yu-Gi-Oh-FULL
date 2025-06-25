import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth'; 
import CardCreationModal from '../components/CardCreationModal'; 
import CardDetailsModal from '../components/CardDetailsModal';

// Debounce para limitar requisições frequentes
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function CardsPage() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, token } = useAuth(); 
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null); 

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(18); 

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchCards = useCallback(async () => {
        setLoading(true); 
        setError(null);
        setCurrentPage(1);

        try {
            const params = new URLSearchParams();
            if (debouncedSearchTerm) params.append('nome', debouncedSearchTerm);
            if (filterType) params.append('tipo', filterType);

            const response = await api.get(`/card?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCards(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Falha ao buscar os cards. Tente novamente.');
            setCards([]);
            console.error('Erro na requisição:', err);
        } finally {
            setLoading(false);
        }

    }, [debouncedSearchTerm, filterType, token]);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    const handleAddCardClick = () => {
        setIsCreationModalOpen(true);
    };

    const handleCloseCreationModal = () => {
        setIsCreationModalOpen(false);
    };

    const handleCardCreated = (newCard) => {
        fetchCards(); 
    };

    const handleCloseDetailsModal = () => {
        setSelectedCard(null);
    };

    return (
        <div className="flex flex-col flex-1 bg-gradient-to-r from-red-900 to-black text-white p-4 md:p-8">
            <div className="container mx-auto">
                {/* Controles de Busca e Filtro */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Insira o nome do card..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow p-2 rounded bg-gray-300 text-black placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 open-sans-text"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="p-2 rounded bg-red-950 border border-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 open-sans-text"
                    >
                        <option value="">Todos</option>
                        <option value="monstro">Monstro</option>
                        <option value="feitico">Feitiço</option>
                    </select>
                    {isAuthenticated && (
                        <button
                            onClick={handleAddCardClick}
                            className="p-2 rounded bg-red-950 hover:bg-red-900 text-gray-300 font-bold focus:outline-none focus:ring-2 focus:ring-red-500 open-sans-text"
                        > 
                            Adicionar Card
                        </button>
                    )}
                </div>
                {/* Grade de Cards */}
                {loading ? (
                    <p className="text-center text-xl">Carregando cards...</p>
                ) : error ? (
                    <p className="text-center text-xl text-red-400">{error}</p>
                ) : cards.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {currentCards.map((card) => (
                                <div 
                                    key={card._id} 
                                    className="bg-gray-900 rounded-lg overflow-hidden shadow-lg shadow-red-900/30 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                                    onClick={() => setSelectedCard(card)}
                                >
                                    <img src={card.imagem || '/assets/images/card-placeholder.png'} alt={card.nome} className="w-full h-auto object-cover" />
                                </div>
                            ))}
                        </div>
                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-8 space-x-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={`px-4 py-2 rounded font-bold open-sans-text ${currentPage === number
                                            ? 'bg-red-700 text-white'
                                            : 'bg-gray-800 hover:bg-red-800'
                                            }`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-xl">Nenhum card encontrado.</p>
                )}
            </div>

            {isCreationModalOpen && (
                <CardCreationModal onClose={handleCloseCreationModal} onCardCreated={handleCardCreated} />
            )}

            {selectedCard && (
                <CardDetailsModal card={selectedCard} onClose={handleCloseDetailsModal} />
            )}
        </div>
    );
}
