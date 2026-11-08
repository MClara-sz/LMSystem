import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Remova o BrowserRouter daqui
import Navbar from './components/NavBar/navbar';
import Auth from './pages/Auth';
import Livros from './pages/livros';

export default function App() {
  return (
    <div>
      {/* A Navbar fica visível em todas as páginas */}
      <Navbar />

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/livros" element={<Livros />} />
        </Routes>
      </div>
    </div>
  );
}