import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CardsPage from '../pages/CardsPage';
import { useAuth } from '../hooks/useAuth';

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/cards"
        element={isAuthenticated ? <CardsPage /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}
