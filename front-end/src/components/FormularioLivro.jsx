export default function FormularioLivro({
  titulo, setTitulo,
  autor, setAutor,
  genero, setGenero,
  isbn, setIsbn,
  sinopse, setSinopse,
  arquivoCapa, setArquivoCapa,
  onSubmit,
  editando = false,
  onCancelarEdicao,
}) {
  return (
    <div className="acervo-card">
      <h2>{editando ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h2>
      <form onSubmit={onSubmit}>
        <div className="acervo-form-group">
          <label>Título</label>
          <input
            type="text"
            placeholder="Nome do livro"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="acervo-input"
          />
        </div>

        <div className="acervo-form-group">
          <label>Autor(es)</label>
          <input
            type="text"
            placeholder="Nome do autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            required
            className="acervo-input"
          />
        </div>

        <div className="acervo-row-2">
          <div className="acervo-form-group">
            <label>Gênero</label>
            <input
              type="text"
              placeholder="Ex: Ficção"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
              className="acervo-input"
            />
          </div>
          <div className="acervo-form-group">
            <label>ISBN</label>
            <input
              type="text"
              placeholder="Código ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
              className="acervo-input"
            />
          </div>
        </div>

        <div className="acervo-form-group">
          <label>Capa do Livro (opcional)</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif"
            onChange={(e) => setArquivoCapa(e.target.files?.[0] || null)}
            className="acervo-input"
          />
          {arquivoCapa && (
            <small style={{ color: '#4b5563', display: 'block', marginTop: '0.25rem' }}>
              Arquivo selecionado: {arquivoCapa.name}
            </small>
          )}
        </div>

        <div className="acervo-form-group">
          <label>Sinopse</label>
          <textarea
            placeholder="Resumo da história..."
            rows="3"
            value={sinopse}
            onChange={(e) => setSinopse(e.target.value)}
            className="acervo-textarea"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button type="submit" className="acervo-btn-submit" style={{ flex: 1 }}>
            {editando ? 'Atualizar Livro' : 'Salvar Livro no Acervo'}
          </button>

          {editando && (
            <button
              type="button"
              onClick={onCancelarEdicao}
              style={{
                background: '#e5e7eb',
                color: '#374151',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}