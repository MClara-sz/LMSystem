import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Passo 3: Notificações
import { AuthProvider } from './contexts/AuthContext'; // Passo 2: Contexto de Autenticação

import Navbar from './components/NavBar/navbar';
import Auth from './pages/Auth';
import Livros from './pages/livros';
import Perfil from './pages/Perfil';
import Emprestimos from './pages/Emprestimos';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';

  return (
    <div>
      {/* Exibe a Navbar em todas as páginas, exceto na tela de Auth */}
      {!isAuthPage && <Navbar />}

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/livros" element={<Livros />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/emprestimos" element={<Emprestimos />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    // Passo 2: O AuthProvider envolve toda a aplicação
    <AuthProvider>
      {/* Passo 3: O Toaster fica disponível globalmente */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <AppContent />
    </AuthProvider>
  );
}