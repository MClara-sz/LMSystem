//TESTE DE LIVROS

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Auth from './pages/Auth';
import Livros from './pages/Livros';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
        <h1 className="font-bold text-lg">Sistema de Biblioteca</h1>
        <div className="space-x-6">
          <Link to="/" className="hover:underline">Login / Cadastro</Link>
          <Link to="/livros" className="hover:underline">Acervo de Livros</Link>
        </div>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/livros" element={<Livros />} />
        </Routes>
      </div>
    </div>
  );
}




/*
!!!!!!TESTE DE AUTENTICACAO!!!!!!!!

import React from 'react';
import Auth from './pages/Auth';

export default function App() {
  return <Auth />;
}

*/

/*import React, { useState, useEffect } from 'react';
import api from './services/api'; // Importando a instância do Axios que vocês configuraram


export default function App() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState('');

  // Sempre que a variável 'busca' mudar, faz a requisição ao Laravel via Axios
  useEffect(() => {
    const timer = setTimeout(() => {
      api.get(`/livros?q=${encodeURIComponent(busca)}`)
        .then((response) => {
          console.log('DADOS VINDOS DO LARAVEL:', response.data);
          
          const data = response.data;
          if (Array.isArray(data)) {
            setLivros(data);
          } else if (data && Array.isArray(data.livros)) {
            setLivros(data.livros);
          } else {
            setLivros([]);
          }
        })
        .catch((err) => {
          console.error('Erro na requisição:', err);
          setLivros([]);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [busca]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pesquisa de Livros</h1>

      <input
        type="text"
        placeholder="Pesquisar por título ou autor..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-6 text-black"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {livros.length === 0 ? (
          <p className="text-gray-500">Nenhum livro encontrado.</p>
        ) : (
          livros.map((livro) => (
            <div key={livro.id} className="p-4 border rounded shadow-sm bg-white text-black">
              <h2 className="font-bold text-lg">{livro.titulo}</h2>
              <p className="text-gray-600">Autor: {livro.autor}</p>
              {livro.categoria && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">
                  {livro.categoria}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
  */