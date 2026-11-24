import { useState } from 'react';

const montarUrlCapa = (urlCapa) => {
  if (!urlCapa) return null;
  if (urlCapa.startsWith('http://') || urlCapa.startsWith('https://')) {
    return urlCapa;
  }
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '');
  const caminhoNormalizado = urlCapa.startsWith('/') ? urlCapa : `/storage/${urlCapa.replace(/^storage\//, '')}`;
  return `${baseUrl}${caminhoNormalizado}`;
};

export default function ListaLivros({
  livros,
  isAdmin,
  livroSelecionadoId,
  onSelecionar,
  onEditar,
  onSolicitarExcluir,
  onBaixarCapa,
}) {
  const [imagensQuebradas, setImagensQuebradas] = useState({});
  const [buscaRapida, setBuscaRapida] = useState('');

  const livroSelecionado =
    livros.find((item) => item.id === livroSelecionadoId) || null;

  const marcarImagemQuebrada = (id) => {
    setImagensQuebradas((prev) => ({ ...prev, [id]: true }));
  };

  const termo = buscaRapida.trim().toLowerCase();
  const livrosFiltrados = !isAdmin && termo
    ? livros.filter((livro) =>
        [livro.titulo, livro.autor, livro.genero]
          .filter(Boolean)
          .some((campo) => String(campo).toLowerCase().includes(termo))
      )
    : livros;

  return (
    <div className="acervo-card" style={{ height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ margin: 0 }}>Livros Cadastrados no Acervo</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={!livroSelecionado || !livroSelecionado.url_capa || imagensQuebradas[livroSelecionado.id]}
            onClick={() => livroSelecionado && onBaixarCapa(livroSelecionado)}
            style={{
              background:
                livroSelecionado && livroSelecionado.url_capa ? '#f1f5f9' : '#f8fafc',
              color:
                livroSelecionado && livroSelecionado.url_capa ? '#334155' : '#94a3b8',
              border: '1px solid #cbd5e1',
              padding: '0.38rem 0.7rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor:
                livroSelecionado && livroSelecionado.url_capa ? 'pointer' : 'not-allowed',
            }}
          >
            Baixar Capa
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                disabled={!livroSelecionado}
                onClick={() => livroSelecionado && onEditar(livroSelecionado)}
                style={{
                  background: '#f8fafc',
                  color: livroSelecionado ? '#334155' : '#94a3b8',
                  border: '1px solid #cbd5e1',
                  padding: '0.38rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: livroSelecionado ? 'pointer' : 'not-allowed',
                }}
              >
                Atualizar
              </button>

              <button
                type="button"
                disabled={!livroSelecionado}
                onClick={() => livroSelecionado && onSolicitarExcluir(livroSelecionado)}
                style={{
                  background: '#ffffff',
                  color: livroSelecionado ? '#991b1b' : '#94a3b8',
                  border: `1px solid ${livroSelecionado ? '#fecaca' : '#e2e8f0'}`,
                  padding: '0.38rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: livroSelecionado ? 'pointer' : 'not-allowed',
                }}
              >
                Excluir
              </button>
            </>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Buscar por título, autor ou gênero..."
            value={buscaRapida}
            onChange={(e) => setBuscaRapida(e.target.value)}
            className="acervo-input"
          />
        </div>
      )}

      {livrosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
          <p>
            {termo
              ? 'Nenhum livro encontrado para essa busca.'
              : 'Nenhum livro cadastrado no momento.'}
          </p>
        </div>
      ) : (
        <div className="acervo-list">
          {livrosFiltrados.map((livro) => {
            const srcCapa = montarUrlCapa(livro.url_capa);
            const mostrarImagem = Boolean(srcCapa) && !imagensQuebradas[livro.id];
            const selecionado = livro.id === livroSelecionadoId;

            return (
              <div
                key={livro.id}
                onClick={() => onSelecionar(livro.id)}
                className="acervo-book-item"
                style={{
                  cursor: 'pointer',
                  background: selecionado ? '#f1f5f9' : '#ffffff',
                  border: `1px solid ${selecionado ? '#94a3b8' : '#e5e7eb'}`,
                  transition: 'background-color 0.15s ease, border-color 0.15s ease',
                }}
              >
                {mostrarImagem ? (
                  <img
                    src={srcCapa}
                    alt="Capa"
                    className="acervo-book-cover"
                    onError={() => marcarImagemQuebrada(livro.id)}
                  />
                ) : (
                  <div
                    className="acervo-book-cover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      color: '#9ca3af',
                      textAlign: 'center',
                    }}
                  >
                    Sem capa
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="acervo-book-info" style={{ fontWeight: 'bold', color: '#1f2937' }}>
                    {livro.titulo}
                  </h3>
                  <p style={{ color: '#4b5563', fontSize: '0.85rem' }}>Autor: {livro.autor}</p>
                  <div className="acervo-tags">
                    <span className="acervo-tag-genre">
                      {livro.genero || 'Gênero não informado'}
                    </span>
                    <span className="acervo-tag-isbn">
                      ISBN: {livro.isbn}
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={selecionado}
                  onChange={() => onSelecionar(livro.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Selecionar ${livro.titulo}`}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#334155',
                    alignSelf: 'center',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}