import { useId, useRef } from 'react';

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
  const inputId = useId();
  const fileInputRef = useRef(null);

  const handleLimparArquivo = () => {
    setArquivoCapa(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
          <label>Capa (PNG ou JPG)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              id={inputId}
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={(e) => setArquivoCapa(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />

            <label
              htmlFor={inputId}
              title="Carregar capa PNG ou JPG"
              aria-label="Carregar capa PNG ou JPG"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </label>

            {arquivoCapa && (
              <>
                <span style={{ fontSize: '0.78rem', color: '#4b5563' }}>
                  {arquivoCapa.name}
                </span>
                <button
                  type="button"
                  onClick={handleLimparArquivo}
                  title="Remover imagem"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '0 0.25rem',
                  }}
                >
                  ✕
                </button>
              </>
            )}
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