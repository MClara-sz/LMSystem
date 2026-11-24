import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BuscaIsbn from '../components/BuscaIsbn';
import FormularioLivro from '../components/FormularioLivro';
import ListaLivros from '../components/ListaLivros';
import './Acervo.css';

const montarUrlCapaDetalhe = (urlCapa) => {
  if (!urlCapa) return null;
  if (urlCapa.startsWith('http://') || urlCapa.startsWith('https://')) {
    return urlCapa;
  }
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '');
  const caminhoNormalizado = urlCapa.startsWith('/') ? urlCapa : `/storage/${urlCapa.replace(/^storage\//, '')}`;
  return `${baseUrl}${caminhoNormalizado}`;
};

export default function Livros() {
  const navigate = useNavigate();
  const [livros, setLivros] = useState([]);
  const [isbnBusca, setIsbnBusca] = useState('');
  const [livroEditandoId, setLivroEditandoId] = useState(null);
  const [livroSelecionadoId, setLivroSelecionadoId] = useState(null);
  const [livroParaExcluir, setLivroParaExcluir] = useState(null);
  const [emprestimosAtivosCount, setEmprestimosAtivosCount] = useState(0);
  const [proximaDevolucao, setProximaDevolucao] = useState(null);

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

  const livroSelecionado =
    livros.find((item) => item.id === livroSelecionadoId) || null;

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
      const lista = Array.isArray(response.data) ? response.data : response.data.livros || [];
      setLivros(lista);
      setLivroSelecionadoId((atual) =>
        lista.some((item) => item.id === atual) ? atual : null
      );
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
    }
  };

  useEffect(() => {
    carregarLivros();
  }, []);

  useEffect(() => {
    if (isAdmin || !localStorage.getItem('token')) return;

    const carregarResumoEmprestimos = async () => {
      try {
        const res = await api.get('/emprestimos');
        const lista = Array.isArray(res.data) ? res.data : res.data.emprestimos || [];
        const ativos = lista.filter(
          (item) => item.situacao !== 'devolvido' && item.status !== 'devolvido'
        );
        setEmprestimosAtivosCount(ativos.length);

        const datas = ativos
          .map((item) => item.data_devolucao_prevista || item.devolucaoPrevista)
          .filter(Boolean)
          .sort();
        setProximaDevolucao(datas[0] || null);
      } catch (err) {
        console.error('Erro ao carregar resumo de empréstimos:', err);
      }
    };

    carregarResumoEmprestimos();
  }, [isAdmin]);

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
          formData.append('_method', 'PUT');
          await api.post(`/livros/${livroEditandoId}`, formData);
          setMensagem('Livro e capa atualizados com sucesso!');
        } else {
          await api.post('/livros', formData);
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
    setLivroSelecionadoId(livro.id);
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

  const handleConfirmarExclusao = async () => {
    if (!livroParaExcluir) return;
    const alvo = livroParaExcluir;
    setLivroParaExcluir(null);
    setMensagem('');

    try {
      await api.delete(`/livros/${alvo.id}`);
      if (livroEditandoId === alvo.id) {
        limparFormulario();
      }
      if (livroSelecionadoId === alvo.id) {
        setLivroSelecionadoId(null);
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

  const capaSelecionadaUrl = livroSelecionado
    ? montarUrlCapaDetalhe(livroSelecionado.url_capa)
    : null;

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

          <div className={isAdmin ? 'acervo-col-right' : 'acervo-col-right acervo-col-user'}>
            <ListaLivros
              livros={livros}
              isAdmin={isAdmin}
              livroSelecionadoId={livroSelecionadoId}
              onSelecionar={(id) =>
                setLivroSelecionadoId((atual) => (atual === id ? null : id))
              }
              onEditar={handleIniciarEdicao}
              onSolicitarExcluir={(livro) => setLivroParaExcluir(livro)}
              onBaixarCapa={handleBaixarCapa}
            />
          </div>

          {!isAdmin && (
            <div className="acervo-col-detalhes-user">
              <div className="acervo-card">
                <h2 style={{ marginTop: 0 }}>Detalhes do Livro</h2>

                {livroSelecionado ? (
                  <div>
                    {capaSelecionadaUrl && (
                      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                        <img
                          src={capaSelecionadaUrl}
                          alt={livroSelecionado.titulo}
                          style={{
                            width: '130px',
                            height: '190px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: '1px solid #e5e7eb',
                          }}
                        />
                      </div>
                    )}

                    <p style={{ margin: 0, color: '#374151', fontSize: '0.92rem', lineHeight: 1.65 }}>
                      O livro <strong>{livroSelecionado.titulo}</strong>, escrito por{' '}
                      <strong>{livroSelecionado.autor || 'autor não informado'}</strong>, pertence ao
                      gênero <strong>{livroSelecionado.genero || 'não informado'}</strong> e possui o
                      ISBN <strong>{livroSelecionado.isbn || 'não informado'}</strong>.{' '}
                      {livroSelecionado.sinopse && livroSelecionado.sinopse.trim() !== ''
                        ? livroSelecionado.sinopse
                        : 'No momento não há sinopse cadastrada para este título.'}
                    </p>

                    <div
                      style={{
                        marginTop: '1.25rem',
                        display: 'flex',
                        gap: '0.6rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {livroSelecionado.url_capa && (
                        <button
                          type="button"
                          onClick={() => handleBaixarCapa(livroSelecionado)}
                          style={{
                            background: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #cbd5e1',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Baixar Capa
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => navigate('/emprestimos')}
                        style={{
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.45rem 0.9rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Ir para Empréstimos
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>
                    Marque um livro na lista ao lado para visualizar a capa e os detalhes completos.
                  </p>
                )}
              </div>

              <div className="acervo-card">
                <h2 style={{ marginTop: 0 }}>Meus Empréstimos</h2>
                <p style={{ margin: '0 0 0.9rem', color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  Você possui <strong>{emprestimosAtivosCount}</strong>{' '}
                  {emprestimosAtivosCount === 1 ? 'empréstimo ativo' : 'empréstimos ativos'}
                  {proximaDevolucao
                    ? ` e a próxima devolução prevista é em ${proximaDevolucao}.`
                    : '.'}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/emprestimos')}
                  style={{
                    background: '#f8fafc',
                    color: '#1e3a8a',
                    border: '1px solid #cbd5e1',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Ver Meus Empréstimos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {livroParaExcluir && (
        <div
          onClick={() => setLivroParaExcluir(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '10px',
              padding: '1.35rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.18)',
              border: '1px solid #e2e8f0',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#0f172a' }}>
              Confirmar exclusão
            </h3>
            <p style={{ margin: '0 0 1.15rem', fontSize: '0.9rem', color: '#475569' }}>
              Deseja realmente excluir <strong>{livroParaExcluir.titulo}</strong> do acervo?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setLivroParaExcluir(null)}
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarExclusao}
                style={{
                  background: '#e2e8f0',
                  color: '#7f1d1d',
                  border: '1px solid #fca5a5',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}