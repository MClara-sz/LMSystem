import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BuscaIsbn from '../components/BuscaIsbn';
import FormularioLivro from '../components/FormularioLivro';
import ListaLivros from '../components/ListaLivros';
import './Acervo.css'; // Importa o estilo dedicado

export default function Livros() {
  const [livros, setLivros] = useState([]);
  const [isbnBusca, setIsbnBusca] = useState('');
  
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [isbn, setIsbn] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [urlCapa, setUrlCapa] = useState('');
  const [mensagem, setMensagem] = useState('');

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
    <div className="acervo-page">
      <div className="acervo-wrapper">
        <div className="acervo-header">
          <h1 className="acervo-title">Gestão de Acervo</h1>
          <p className="acervo-subtitle">Consulte por ISBN ou cadastre novos livros na biblioteca.</p>
        </div>

        {mensagem && (
          <div className="acervo-message">
            {mensagem}
          </div>
        )}

        <div className="acervo-grid">
          <div className="acervo-col-left">
            <BuscaIsbn 
              isbnBusca={isbnBusca} 
              setIsbnBusca={setIsbnBusca} 
              onBuscar={handleBuscarPorIsbn} 
            />
            
            <FormularioLivro 
              titulo={titulo} setTitulo={setTitulo}
              autor={autor} setAutor={setAutor}
              genero={genero} setGenero={setGenero}
              isbn={isbn} setIsbn={setIsbn}
              sinopse={sinopse} setSinopse={setSinopse}
              onSubmit={handleCadastrarLivro}
            />
          </div>

          <div className="acervo-col-right">
            <ListaLivros livros={livros} />
          </div>
        </div>
      </div>
    </div>
  );
}