export default function BuscaIsbn({ isbnBusca, setIsbnBusca, onBuscar }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full" style={{ padding: '24px' }}>
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-lg font-bold text-gray-800">Pesquisa Rápida por ISBN</h2>
        
        <div className="flex items-center gap-3 w-full">
          <input
            type="text"
            placeholder="Ex: 9786559608874"
            value={isbnBusca}
            onChange={(e) => setIsbnBusca(e.target.value)}
            style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
          />
          <button
            type="button"
            onClick={onBuscar}
            style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '12px', paddingBottom: '12px' }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition shadow-sm whitespace-nowrap shrink-0"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}