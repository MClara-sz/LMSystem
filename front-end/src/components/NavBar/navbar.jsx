import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importante usar o Link do react-router-dom
import './navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao carregar utilizador", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 className="navbar-title">
            <Link to="/livros" className="navbar-link">📚 Sistema de Biblioteca</Link>
          </h1>

          {/* NOVOS LINKS DE NAVEGAÇÃO */}
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            <Link to="/livros" className="navbar-link" style={{ fontSize: '0.95rem' }}>Acervo</Link>
            <Link to="/emprestimos" className="navbar-link" style={{ fontSize: '0.95rem' }}>Meus Empréstimos</Link>
            <Link to="/perfil" className="navbar-link" style={{ fontSize: '0.95rem' }}>Meu Perfil</Link>
            
            {/* Opcional: Se quiser que o Admin apareça */}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="navbar-link" style={{ fontSize: '0.95rem', color: '#fde047' }}>Painel Admin</Link>
            )}
          </div>
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="navbar-user-area">
              <div className="navbar-avatar-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>

              <div className="navbar-user-details">
                <span className="navbar-greeting">
                  Olá, <strong>{user.name}</strong>
                </span>
                <button onClick={handleLogout} className="navbar-logout-btn">
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="navbar-links">
              <Link to="/" className="navbar-link">Entrar</Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}