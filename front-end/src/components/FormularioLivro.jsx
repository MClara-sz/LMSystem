export default function FormularioLivro({
  titulo, setTitulo,
  autor, setAutor,
  genero, setGenero,
  isbn, setIsbn,
  sinopse, setSinopse,
  onSubmit
}) {
  return (
    <div className="acervo-card">
      <h2>Cadastrar Novo Livro</h2>
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
          <label>Sinopse</label>
          <textarea
            placeholder="Resumo da história..."
            rows="3"
            value={sinopse}
            onChange={(e) => setSinopse(e.target.value)}
            className="acervo-textarea"
          />
        </div>

        <button type="submit" className="acervo-btn-submit">
          Salvar Livro no Acervo
        </button>
      </form>
    </div>
  );
}