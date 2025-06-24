// src/components/layout/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiLogInCircle } from "react-icons/bi";
import { BiLogOutCircle } from "react-icons/bi";
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-red-900 to-black relative">
      <div className="w-full flex items-center justify-center px-4 py-2 max-w-screen-2xl mx-auto">
        <div className="text-center">
          <Link to="/">
            <img
              src="/assets/images/yugioh-logo.png"
              alt="Yugioh Logo - Home"
              className="w-40 h-auto"
            />
          </Link>
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {isAuthenticated ? (
          <button onClick={logout} className="text-red-950 hover:text-red-900" aria-label="Logout">
            <BiLogOutCircle size={30} />
          </button>
        ) : (
          <button
            onClick={() => openLoginModal(() => navigate('/cards'))}
            className="text-red-950 hover:text-red-900"
            aria-label="Login"
          >
            <BiLogInCircle size={30} />
          </button>
        )}
      </div>
    </header>
  );
}
