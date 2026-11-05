import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Livros() {
  const [livros, setLivros] = useState([]);
  const [isbnBusca, setIsbnBusca] = useState('');
  
  // Campos do formulário de cadastro de livro
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [isbn, setIsbn] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [urlCapa, setUrlCapa] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Carregar lista de livros ao abrir a página
  const carregarLivros = async () => {
    try {
      const response = await api.get('/livros');
      setLivros(Array.isArray(response.data) ? response.data : response.data.livros || []);
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
    }
  };

  useEffect(() => {
    carregarLivros();
  }, []);

  // Buscar dados automaticamente pelo ISBN (BrasilAPI)
  const handleBuscarPorIsbn = async () => {
    if (!isbnBusca) return;
    setMensagem('');
    try {
      const response = await api.get(`/livros/isbn/${isbnBusca}`);
      const dados = response.data;
      
      setTitulo(dados.titulo || '');
      setAutor(dados.autor || '');
      setSinopse(dados.sinopse || '');
      setUrlCapa(dados.url_capa || '');
      setIsbn(isbnBusca);
      setMensagem('Livro encontrado na BrasilAPI! Preencha o gênero e salve.');
    } catch (err) {
      console.error(err);
      setMensagem('Livro não encontrado com este ISBN.');
    }
  };

  // Cadastrar novo livro no banco de dados
  const handleCadastrarLivro = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      await api.post('/livros', {
        titulo,
        autor,
        genero,
        isbn,
        sinopse,
        url_capa: urlCapa
      });

      setMensagem('Livro cadastrado com sucesso!');
      setTitulo('');
      setAutor('');
      setGenero('');
      setIsbn('');
      setSinopse('');
      setUrlCapa('');
      carregarLivros();
    } catch (err) {
      console.error(err);
      setMensagem('Erro ao cadastrar livro. Verifique os campos.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Gestão de Acervo</h1>
          <p className="text-sm text-gray-500 mt-1">Consulte por ISBN ou cadastre novos livros na biblioteca.</p>
        </div>
      </div>

      {mensagem && (
        <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-600 text-indigo-700 rounded-r shadow-sm text-sm font-medium">
          {mensagem}
        </div>
      )}

      {/* Grid Principal: Esquerda (Busca e Cadastro), Direita (Acervo) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coluna da Esquerda: Ações (Busca por ISBN & Formulário) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Seção de Busca por ISBN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Pesquisa Rápida por ISBN</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: 9786559608874"
                value={isbnBusca}
                onChange={(e) => setIsbnBusca(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
              />
              <button
                type="button"
                onClick={handleBuscarPorIsbn}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Formulário de Cadastro */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Cadastrar Novo Livro</h2>
            <form onSubmit={handleCadastrarLivro} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Nome do livro"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Autor(es)</label>
                <input
                  type="text"
                  placeholder="Nome do autor"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Gênero</label>
                  <input
                    type="text"
                    placeholder="Ex: Ficção"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">ISBN</label>
                  <input
                    type="text"
                    placeholder="Código ISBN"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Sinopse</label>
                <textarea
                  placeholder="Resumo da história..."
                  rows="3"
                  value={sinopse}
                  onChange={(e) => setSinopse(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold text-sm transition shadow-sm mt-2"
              >
                Salvar Livro no Acervo
              </button>
            </form>
          </div>

        </div>

        {/* Coluna da Direita: Listagem de Livros Cadastrados */}
        <div className="lg:col-span-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Livros Cadastrados no Acervo</h2>
            
            {livros.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>Nenhum livro cadastrado no momento.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                {livros.map((livro) => (
                  <div key={livro.id} className="p-4 border border-gray-100 rounded-2xl shadow-xs bg-white hover:border-blue-200 transition flex gap-4 items-start">
                    {livro.url_capa ? (
                      <img src={livro.url_capa} alt="Capa" className="w-16 h-24 object-cover rounded-xl shadow-xs shrink-0" />
                    ) : (
                      <div className="w-16 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400 shrink-0">Sem capa</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base truncate">{livro.titulo}</h3>
                      <p className="text-gray-600 text-sm truncate">Autor: {livro.autor}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                          {livro.genero || 'Gênero não informado'}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-mono">
                          ISBN: {livro.isbn}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}