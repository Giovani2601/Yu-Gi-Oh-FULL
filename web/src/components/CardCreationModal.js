import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function CardCreationModal({ onClose, onCardCreated }) {
    const { token } = useAuth(); 
    const [formData, setFormData] = useState({
        nome: '',
        tipo: 'monstro',
        descricao: '',
        imagem: '',
        nivel: '',
        ataque: '',
        defesa: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newData = { ...prevData, [name]: value };
            if (name === 'tipo' && value === 'feitico') {
                newData.nivel = '';
                newData.ataque = '';
                newData.defesa = '';
            }
            return newData;
        });

        if (formErrors[name]) {
            setFormErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                if (name === 'tipo' && value === 'feitico') {
                    delete newErrors.nivel;
                    delete newErrors.ataque;
                    delete newErrors.defesa;
                }
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.nome) errors.nome = 'O nome é obrigatório.';
        else if (formData.nome.length < 2) errors.nome = 'O nome deve ter no mínimo 2 caracteres.';
        else if (formData.nome.length > 100) errors.nome = 'O nome deve ter no máximo 100 caracteres.';

        if (!formData.descricao) errors.descricao = 'A descrição é obrigatória.';
        else if (formData.descricao.length > 1000) errors.descricao = 'A descrição deve ter no máximo 1000 caracteres.';

        if (formData.imagem && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.imagem)) {
            errors.imagem = 'Por favor, insira uma URL de imagem válida.';
        }

        if (formData.tipo === 'monstro') {
            if (!formData.nivel) errors.nivel = 'O nível é obrigatório.';
            else if (formData.nivel < 1 || formData.nivel > 12) errors.nivel = 'O nível deve ser entre 1 e 12.';

            if (formData.ataque === '' || formData.ataque === null) errors.ataque = 'O ataque é obrigatório.';
            else if (formData.ataque < 0 || formData.ataque > 9999) errors.ataque = 'O ataque deve ser entre 0 e 9999.';

            if (formData.defesa === '' || formData.defesa === null) errors.defesa = 'A defesa é obrigatória.';
            else if (formData.defesa < 0 || formData.defesa > 9999) errors.defesa = 'A defesa deve ser entre 0 e 9999.';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return; 
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const dataToSend = { ...formData };
            if (dataToSend.tipo === 'feitico') {
                delete dataToSend.nivel;
                delete dataToSend.ataque;
                delete dataToSend.defesa;
            }

            const response = await api.post('/card', dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess(true);
            onCardCreated(response.data);
            setTimeout(onClose, 1000); 
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar o card. Tente novamente.');
            console.error('Erro ao criar card:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}>
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-4xl text-red-950 font-bold mb-4 text-center cormorant-garamond-title">Criar Card</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-semibold text-red-900">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            placeholder='Insira o nome do card...'
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full p-2 rounded bg-white border border-red-900 text-gray-900 focus:ring-red-500 focus:border-red-500"
                        />
                        {formErrors.nome && <p className="text-red-600 text-xs mt-1">{formErrors.nome}</p>}
                    </div>

                    <div>
                        <label htmlFor="descricao" className="block text-sm font-semibold text-red-900">Descrição:</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            placeholder='Insira a descrição do card...'
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="mt-1 block w-full p-2 rounded bg-white border border-red-900 text-gray-900 focus:ring-red-500 focus:border-red-500"
                        ></textarea>
                        {formErrors.descricao && <p className="text-red-600 text-xs mt-1">{formErrors.descricao}</p>}
                    </div>

                    <div>
                        <label htmlFor="imagem" className="block text-sm font-semibold text-red-900">URL da Imagem (Opcional):</label>
                        <input
                            type="url"
                            id="imagem"
                            name="imagem"
                            placeholder='Insira a URL da imagem do card...'
                            value={formData.imagem}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 rounded bg-white border border-red-900 text-gray-900 focus:ring-red-500 focus:border-red-500"
                        />
                        {formErrors.imagem && <p className="text-red-600 text-xs mt-1">{formErrors.imagem}</p>}
                    </div>

                    {/* Tipo e Nível */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={formData.tipo === 'monstro' ? 'col-span-1' : 'col-span-2'}>
                            <label htmlFor="tipo" className="block text-sm font-semibold text-red-900">Tipo:</label>
                            <select
                                id="tipo"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 rounded bg-white border border-red-900 text-gray-900 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="monstro">Monstro</option>
                                <option value="feitico">Feitiço</option>
                            </select>
                        </div>
                        {formData.tipo === 'monstro' && (
                            <div>
                                <label htmlFor="nivel" className="block text-sm font-semibold text-red-900">Nível:</label>
                                <input type="number" id="nivel" name="nivel" value={formData.nivel} onChange={handleChange} min="1" max="12" required className="mt-1 block w-full p-2 rounded bg-white border border-red-900 text-gray-900 focus:ring-red-500 focus:border-red-500" />
                                {formErrors.nivel && <p className="text-red-600 text-xs mt-1">{formErrors.nivel}</p>}
                            </div>
                        )}
                    </div>

                    {/* Ataque e Defesa */}
                    {formData.tipo === 'monstro' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ataque" className="block text-sm font-semibold text-red-900">Ataque:</label>
                                <input type="number" id="ataque" name="ataque" value={formData.ataque} onChange={handleChange} min="0" max="9999" required className="mt-1 block w-full p-2 rounded bg-white border border-red-900 text-gray-900 focus:ring-red-500 focus:border-red-500" />
                                {formErrors.ataque && <p className="text-red-600 text-xs mt-1">{formErrors.ataque}</p>}
                            </div>
                            <div>
                                <label htmlFor="defesa" className="block text-sm font-semibold text-red-900">Defesa:</label>
                                <input type="number" id="defesa" name="defesa" value={formData.defesa} onChange={handleChange} min="0" max="9999" required className="mt-1 block w-full p-2 rounded bg-white border border-red-900 text-gray-900 focus:ring-red-500 focus:border-red-500" />
                                {formErrors.defesa && <p className="text-red-600 text-xs mt-1">{formErrors.defesa}</p>}
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-600 text-sm text-center">Card criado com sucesso!</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-red-900 hover:bg-red-950 rounded-md text-white font-bold transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Criando...' : 'Criar Card'}
                    </button>
                </form>
            </div>
        </div>
    );
}