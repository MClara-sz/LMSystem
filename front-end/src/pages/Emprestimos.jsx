import React, { useState } from 'react';

export default function Emprestimos() {
  // Estado para controlar a aba ativa (ativos ou historico)
  const [abaAtiva, setAbaAtiva] = useState('ativos');

  // Estado para controlar a abertura do modal de novo empréstimo
  const [mostrarModal, setMostrarModal] = useState(false);

  // Dados fictícios visuais para simular a biblioteca
  const [emprestimosAtivos, setEmprestimosAtivos] = useState([
    { id: 1, livro: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', dataEmprestimo: '01/06/2026', devolucaoPrevista: '15/06/2026', estado: 'No Prazo' },
    { id: 2, livro: 'Jantar Secreto', autor: 'Raphael Montes', dataEmprestimo: '20/05/2026', devolucaoPrevista: '03/06/2026', estado: 'Atrasado' },
    { id: 3, livro: 'Saboroso Cadáver', autor: 'Agustina Bazterrica', dataEmprestimo: '05/06/2026', devolucaoPrevista: '19/06/2026', estado: 'No Prazo' }
  ]);

  const [historico] = useState([
    { id: 101, livro: 'Exumados', dataDevolucao: '10/05/2026', status: 'Devolvido no prazo' }
  ]);

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Cabeçalho da Página */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e3a8a', fontWeight: 'bold', margin: 0 }}>Gestão de Empréstimos</h2>
          <p style={{ color: '#6b7280', margin: '0.4rem 0 0 0' }}>Consulte os prazos, histórico e faça novos empréstimos de livros.</p>
        </div>
        <button 
          onClick={() => setMostrarModal(true)}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
        >
          + Novo Empréstimo
        </button>
      </div>

      {/* Cartões de Estatísticas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #2563eb' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Empréstimos Ativos</span>
          <h3 style={{ fontSize: '1.8rem', color: '#111827', margin: '0.5rem 0 0 0' }}>3</h3>
        </div>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #ef4444' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Livros em Atraso</span>
          <h3 style={{ fontSize: '1.8rem', color: '#ef4444', margin: '0.5rem 0 0 0' }}>1</h3>
        </div>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Devoluções este Mês</span>
          <h3 style={{ fontSize: '1.8rem', color: '#10b981', margin: '0.5rem 0 0 0' }}>8</h3>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setAbaAtiva('ativos')}
          style={{ background: 'transparent', border: 'none', padding: '0.75rem 1rem', fontWeight: 'bold', color: abaAtiva === 'ativos' ? '#2563eb' : '#6b7280', borderBottom: abaAtiva === 'ativos' ? '2px solid #2563eb' : 'none', cursor: 'pointer', marginBottom: '-2px' }}
        >
          Empréstimos Ativos
        </button>
        <button 
          onClick={() => setAbaAtiva('historico')}
          style={{ background: 'transparent', border: 'none', padding: '0.75rem 1rem', fontWeight: 'bold', color: abaAtiva === 'historico' ? '#2563eb' : '#6b7280', borderBottom: abaAtiva === 'historico' ? '2px solid #2563eb' : 'none', cursor: 'pointer', marginBottom: '-2px' }}
        >
          Histórico de Devoluções
        </button>
      </div>

      {/* Conteúdo da Tabela */}
      <div style={{ background: '#ffffff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {abaAtiva === 'ativos' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem' }}>Livro</th>
                <th style={{ padding: '1rem' }}>Autor</th>
                <th style={{ padding: '1rem' }}>Data Empréstimo</th>
                <th style={{ padding: '1rem' }}>Devolução Prevista</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosAtivos.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b' }}>{item.livro}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{item.autor}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{item.dataEmprestimo}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{item.devolucaoPrevista}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      background: item.estado === 'Atrasado' ? '#fee2e2' : '#dcfce7',
                      color: item.estado === 'Atrasado' ? '#991b1b' : '#166534'
                    }}>
                      {item.estado}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' }}>
                      Registar Devolução
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem' }}>Livro</th>
                <th style={{ padding: '1rem' }}>Data da Devolução</th>
                <th style={{ padding: '1rem' }}>Estado Final</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b' }}>{item.livro}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{item.dataDevolucao}</td>
                  <td style={{ padding: '1rem', color: '#166534', fontWeight: '500' }}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Simulado de Novo Empréstimo */}
      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e3a8a' }}>Novo Empréstimo de Livro</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>ISBN ou Nome do Livro</label>
                <input type="text" placeholder="Ex: 9788533613379" style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Nome do Utilizador / Aluno</label>
                <input type="text" placeholder="Ex: Maria Clara" style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Prazo de Devolução</label>
                <input type="date" style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => setMostrarModal(false)}
                  style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setMostrarModal(false)}
                  style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Concluir Empréstimo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}