import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BuscaIsbn from '../components/BuscaIsbn';
import FormularioLivro from '../components/FormularioLivro';
import ListaLivros from '../components/ListaLivros';
import './Acervo.css';

export default function Livros() {
  const [livros, setLivros] = useState([]);
  const [isbnBusca, setIsbnBusca] = useState('');
  const [livroEditandoId, setLivroEditandoId] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [isbn, setIsbn] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [urlCapa, setUrlCapa] = useState('');
  const [arquivoCapa, setArquivoCapa] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const userStorage = localStorage.getItem('user');
  const user = userStorage ? JSON.parse(userStorage) : null;

  const isAdmin =
    user?.perfil === 'admin' ||
    user?.is_admin === true ||
    user?.role === 'admin';

  const limparFormulario = () => {
    setLivroEditandoId(null);
    setTitulo('');
    setAutor('');
    setGenero('');
    setIsbn('');
    setSinopse('');
    setUrlCapa('');
    setArquivoCapa(null);
  };

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
      setArquivoCapa(null);
      setIsbn(isbnBusca);
      setMensagem('Livro encontrado na BrasilAPI! Preencha o gênero e salve.');
    } catch (err) {
      console.error(err);
      setMensagem('Livro não encontrado com este ISBN.');
    }
  };

  const handleSalvarLivro = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      if (arquivoCapa) {
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('autor', autor);
        formData.append('genero', genero);
        formData.append('isbn', isbn);
        formData.append('sinopse', sinopse || '');
        formData.append('capa', arquivoCapa);

        if (livroEditandoId) {
          // _method=PUT ajuda o PHP/Laravel a ler arquivos em atualizações
          formData.append('_method', 'PUT');
          await api.post(`/livros/${livroEditandoId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setMensagem('Livro e capa atualizados com sucesso!');
        } else {
          await api.post('/livros', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setMensagem('Livro cadastrado com sucesso!');
        }
      } else {
        const payload = {
          titulo,
          autor,
          genero,
          isbn,
          sinopse,
          url_capa: urlCapa,
        };

        if (livroEditandoId) {
          await api.put(`/livros/${livroEditandoId}`, payload);
          setMensagem('Livro atualizado com sucesso!');
        } else {
          await api.post('/livros', payload);
          setMensagem('Livro cadastrado com sucesso!');
        }
      }

      limparFormulario();
      carregarLivros();
    } catch (err) {
      console.error(err);
      setMensagem(
        livroEditandoId
          ? 'Erro ao atualizar livro. Verifique os campos.'
          : 'Erro ao cadastrar livro. Verifique os campos.'
      );
    }
  };

  const handleIniciarEdicao = (livro) => {
    setLivroEditandoId(livro.id);
    setTitulo(livro.titulo || '');
    setAutor(livro.autor || '');
    setGenero(livro.genero || '');
    setIsbn(livro.isbn || '');
    setSinopse(livro.sinopse || '');
    setUrlCapa(livro.url_capa || '');
    setArquivoCapa(null);
    setMensagem(`Editando "${livro.titulo}". Altere os campos e salve.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluirLivro = async (livro) => {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir o livro "${livro.titulo}"?`
    );
    if (!confirmado) return;

    setMensagem('');
    try {
      await api.delete(`/livros/${livro.id}`);
      if (livroEditandoId === livro.id) {
        limparFormulario();
      }
      setMensagem('Livro excluído com sucesso!');
      carregarLivros();
    } catch (err) {
      console.error(err);
      const msgApi = err.response?.data?.message;
      setMensagem(msgApi || 'Erro ao excluir livro.');
    }
  };

  const handleBaixarCapa = async (livro) => {
    setMensagem('');
    try {
      const response = await api.get(`/livros/${livro.id}/download-capa`, {
        responseType: 'blob',
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `capa-${livro.id}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Erro ao baixar capa:', err);
      const msgApi =
        err.response?.data instanceof Blob
          ? null
          : err.response?.data?.message;
      setMensagem(msgApi || 'Não foi possível baixar a capa deste livro.');
    }
  };

  return (
    <div className="acervo-page">
      <div className="acervo-wrapper">
        <div className="acervo-header">
          <h1 className="acervo-title">Gestão de Acervo</h1>
          <p className="acervo-subtitle">
            {isAdmin
              ? 'Consulte por ISBN ou cadastre novos livros na biblioteca.'
              : 'Consulte os livros cadastrados no acervo da biblioteca.'}
          </p>
        </div>

        {mensagem && <div className="acervo-message">{mensagem}</div>}

        <div className="acervo-grid">
          {isAdmin && (
            <div className="acervo-col-left">
              <BuscaIsbn
                isbnBusca={isbnBusca}
                setIsbnBusca={setIsbnBusca}
                onBuscar={handleBuscarPorIsbn}
              />

              <FormularioLivro
                titulo={titulo}
                setTitulo={setTitulo}
                autor={autor}
                setAutor={setAutor}
                genero={genero}
                setGenero={setGenero}
                isbn={isbn}
                setIsbn={setIsbn}
                sinopse={sinopse}
                setSinopse={setSinopse}
                arquivoCapa={arquivoCapa}
                setArquivoCapa={setArquivoCapa}
                onSubmit={handleSalvarLivro}
                editando={Boolean(livroEditandoId)}
                onCancelarEdicao={limparFormulario}
              />
            </div>
          )}

          <div className={isAdmin ? 'acervo-col-right' : 'acervo-col-right w-full'}>
            <ListaLivros
              livros={livros}
              isAdmin={isAdmin}
              onEditar={handleIniciarEdicao}
              onExcluir={handleExcluirLivro}
              onBaixarCapa={handleBaixarCapa}
            />
          </div>
        </div>
      </div>
    </div>
  );
}