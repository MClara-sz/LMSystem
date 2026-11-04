import React, { useState, useEffect } from 'react';

export default function App() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState('');

  // Sempre que a variável 'busca' mudar, faz a requisição ao Laravel com o parâmetro ?q=
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`http://127.0.0.1:8000/api/livros?q=${encodeURIComponent(busca)}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('DADOS VINDOS DO LARAVEL:', data);
          
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
    }, 300); // Pequeno atraso (debounce) para não disparar requisições a cada tecla muito rápido

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