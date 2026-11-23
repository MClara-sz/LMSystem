const montarUrlCapa = (urlCapa) => {
  if (!urlCapa) return null;
  if (urlCapa.startsWith('http://') || urlCapa.startsWith('https://')) {
    return urlCapa;
  }
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '');
  return `${baseUrl}${urlCapa.startsWith('/') ? '' : '/'}${urlCapa}`;
};

export default function ListaLivros({ livros, isAdmin, onEditar, onExcluir, onBaixarCapa }) {
  return (
    <div className="acervo-card" style={{ height: '100%' }}>
      <h2>Livros Cadastrados no Acervo</h2>

      {livros.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
          <p>Nenhum livro cadastrado no momento.</p>
        </div>
      ) : (
        <div className="acervo-list">
          {livros.map((livro) => {
            const srcCapa = montarUrlCapa(livro.url_capa);

            return (
              <div key={livro.id} className="acervo-book-item">
                {srcCapa ? (
                  <img src={srcCapa} alt="Capa" className="acervo-book-cover" />
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {livro.url_capa && (
                    <button
                      type="button"
                      onClick={() => onBaixarCapa(livro)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.35rem 0.7rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Baixar Capa
                    </button>
                  )}

                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => onEditar(livro)}
                        style={{
                          background: '#f59e0b',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.35rem 0.7rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onExcluir(livro)}
                        style={{
                          background: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.35rem 0.7rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}