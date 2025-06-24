import React, { createContext, useState, useEffect } from 'react';
import { loginRequest } from '../services/authService';
import api from '../services/api';
import LoginModal from '../components/modals/LoginModal';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [onLoginSuccess, setOnLoginSuccess] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);
        setIsAuthenticated(true);

        // Configura o token no axios
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email, senha) => {
    const data = await loginRequest(email, senha);
    const { token: jwt, usuario } = data;
    setToken(jwt);
    setUser(usuario);
    setIsAuthenticated(true);
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(usuario));

    // Configura o token no axios
    api.defaults.headers.common.Authorization = `Bearer ${jwt}`;

    if (onLoginSuccess) {
      onLoginSuccess(usuario);
      setOnLoginSuccess(null);
    }
    return usuario;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
  };

  const openLoginModal = (onSuccess) => {
    if (onSuccess) setOnLoginSuccess(() => onSuccess);
    setShowLoginModal(true);
  };
  const closeLoginModal = () => {
    setShowLoginModal(false);
    setOnLoginSuccess(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      login,
      logout,
      showLoginModal,
      openLoginModal,
      closeLoginModal
    }}>
      {children}
      {showLoginModal && <LoginModal onClose={closeLoginModal} />}
    </AuthContext.Provider>
  );
}
