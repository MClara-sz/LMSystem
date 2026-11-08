import { Link } from 'react-router-dom';
import './navbar.css'; // Importa o arquivo CSS correspondente

export default function Navbar() {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar-container">
        <h1 className="navbar-title">Sistema de Biblioteca</h1>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Login / Cadastro</Link>
          <Link to="/livros" className="navbar-link">Acervo de Livros</Link>
        </div>
      </nav>
    </div>
  );
}