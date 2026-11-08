export default function ListaLivros({ livros }) {
  return (
    <div className="acervo-card" style={{ height: '100%' }}>
      <h2>Livros Cadastrados no Acervo</h2>
      
      {livros.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
          <p>Nenhum livro cadastrado no momento.</p>
        </div>
      ) : (
        <div className="acervo-list">
          {livros.map((livro) => (
            <div key={livro.id} className="acervo-book-item">
              {livro.url_capa ? (
                <img src={livro.url_capa} alt="Capa" className="acervo-book-cover" />
              ) : (
                <div className="acervo-book-cover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#9ca3af', textAlign: 'center' }}>
                  Sem capa
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="acervo-book-info" style={{ fontWeight: 'bold', color: '#1f2937' }}>{livro.titulo}</h3>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}