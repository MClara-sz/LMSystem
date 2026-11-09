import React, { useEffect, useState } from 'react';
import './Navbar.css';

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
        <h1 className="navbar-title">
          <a href="/livros" className="navbar-link">📚 Sistema de Biblioteca</a>
        </h1>

        <div className="navbar-right">
          {user ? (
            <div className="navbar-user-area">
              {/* Ícone de Avatar */}
              <div className="navbar-avatar-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>

              {/* Bloco contendo o nome e o botão empilhados */}
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
              <a href="/" className="navbar-link">Entrar</a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}