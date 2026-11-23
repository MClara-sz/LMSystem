import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Emprestimos() {
  const hoje = () => new Date().toISOString().split('T')[0];

  const [abaAtiva, setAbaAtiva] = useState('ativos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [emprestimos, setEmprestimos] = useState([]);
  const [livros, setLivros] = useState([]);
  const [mensagem, setMensagem] = useState('');

  // Campos do modal de novo empréstimo
  const [livroId, setLivroId] = useState('');
  const [dataDevolucaoPrevista, setDataDevolucaoPrevista] = useState('');

  // Estados do modal de devolução
  const [emprestimoParaDevolver, setEmprestimoParaDevolver] = useState(null);
  const [dataDevolucao, setDataDevolucao] = useState(hoje());

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [resEmprestimos, resLivros] = await Promise.all([
        api.get('/emprestimos'),
        api.get('/livros'),
      ]);

      const listaEmprestimos = Array.isArray(resEmprestimos.data)
        ? resEmprestimos.data
        : resEmprestimos.data.emprestimos || [];

      const listaLivros = Array.isArray(resLivros.data)
        ? resLivros.data
        : resLivros.data.livros || [];

      setEmprestimos(listaEmprestimos);
      setLivros(listaLivros);
    } catch (err) {
      console.error('Erro ao carregar dados de empréstimos:', err);
      setMensagem('Não foi possível carregar os empréstimos da API.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCriarEmprestimo = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      await api.post('/emprestimos', {
        livro_id: livroId,
        usuario_id: user?.id,
        data_emprestimo: hoje(),
        data_devolucao_prevista: dataDevolucaoPrevista,
        situacao: 'ativo',
      });

      setMostrarModal(false);
      setLivroId('');
      setDataDevolucaoPrevista('');
      setMensagem('Empréstimo registrado com sucesso!');
      carregarDados();
    } catch (err) {
      console.error('Erro ao criar empréstimo:', err);
      setMensagem('Erro ao registrar empréstimo. Verifique os dados e a API.');
    }
  };

  const abrirModalDevolucao = (emprestimo) => {
    setEmprestimoParaDevolver(emprestimo);
    setDataDevolucao(hoje());
  };

  const confirmarDevolucao = async (e) => {
    e.preventDefault();
    if (!emprestimoParaDevolver) return;

    setMensagem('');
    try {
      await api.put(`/emprestimos/${emprestimoParaDevolver.id}`, {
        situacao: 'devolvido',
        data_devolucao_real: dataDevolucao,
      });

      setEmprestimoParaDevolver(null);
      setMensagem('Devolução registrada com sucesso!');
      carregarDados();
    } catch (err) {
      console.error('Erro ao registrar devolução:', err);
      setMensagem('Erro ao registrar devolução.');
    }
  };

  const emprestimosAtivos = emprestimos.filter(
    (item) => item.situacao !== 'devolvido' && item.status !== 'devolvido'
  );

  const historico = emprestimos.filter(
    (item) => item.situacao === 'devolvido' || item.status === 'devolvido'
  );

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e3a8a', fontWeight: 'bold', margin: 0 }}>Gestão de Empréstimos</h2>
          <p style={{ color: '#6b7280', margin: '0.4rem 0 0 0' }}>Consulte os prazos, histórico e faça novos empréstimos de livros.</p>
        </div>
        <button
          onClick={() => setMostrarModal(true)}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
        >
          + Novo Empréstimo
        </button>
      </div>

      {mensagem && (
        <div style={{ marginBottom: '1.5rem', padding: '0.9rem 1.2rem', background: '#eff6ff', color: '#1e40af', borderRadius: '8px' }}>
          {mensagem}
        </div>
      )}

      {/* Abas */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e5e7eb', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setAbaAtiva('ativos')}
          style={{ background: 'transparent', border: 'none', padding: '0.75rem 1rem', fontWeight: 'bold', color: abaAtiva === 'ativos' ? '#2563eb' : '#6b7280', borderBottom: abaAtiva === 'ativos' ? '2px solid #2563eb' : 'none', cursor: 'pointer', marginBottom: '-2px' }}
        >
          Empréstimos Ativos ({emprestimosAtivos.length})
        </button>
        <button
          onClick={() => setAbaAtiva('historico')}
          style={{ background: 'transparent', border: 'none', padding: '0.75rem 1rem', fontWeight: 'bold', color: abaAtiva === 'historico' ? '#2563eb' : '#6b7280', borderBottom: abaAtiva === 'historico' ? '2px solid #2563eb' : 'none', cursor: 'pointer', marginBottom: '-2px' }}
        >
          Histórico de Devoluções ({historico.length})
        </button>
      </div>

      {/* Tabela */}
      <div style={{ background: '#ffffff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {carregando ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Carregando empréstimos...
          </div>
        ) : abaAtiva === 'ativos' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Livro</th>
                <th style={{ padding: '1rem' }}>Data Empréstimo</th>
                <th style={{ padding: '1rem' }}>Devolução Prevista</th>
                <th style={{ padding: '1rem' }}>Situação</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {emprestimosAtivos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Nenhum empréstimo ativo no momento.
                  </td>
                </tr>
              ) : (
                emprestimosAtivos.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b' }}>
                      {item.livro?.titulo || item.livro_titulo || `Livro #${item.livro_id}`}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      {item.data_emprestimo || item.dataEmprestimo || '-'}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      {item.data_devolucao_prevista || item.devolucaoPrevista || '-'}
                    </td>
                    <td style={{ padding: '1rem', color: '#166534', fontWeight: '600' }}>
                      {item.situacao || 'Ativo'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => abrirModalDevolucao(item)}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '500' }}
                      >
                        Registrar Devolução
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem' }}>Livro</th>
                <th style={{ padding: '1rem' }}>Data da Devolução</th>
                <th style={{ padding: '1rem' }}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {historico.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    Nenhuma devolução registrada ainda.
                  </td>
                </tr>
              ) : (
                historico.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b' }}>
                      {item.livro?.titulo || `Livro #${item.livro_id}`}
                    </td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>
                      {item.data_devolucao_real || item.data_devolucao || '-'}
                    </td>
                    <td style={{ padding: '1rem', color: '#166534', fontWeight: '500' }}>
                      {item.situacao || 'Devolvido'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Novo Empréstimo */}
      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={handleCriarEmprestimo} style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e3a8a' }}>Novo Empréstimo de Livro</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Livro</label>
                <select
                  value={livroId}
                  onChange={(e) => setLivroId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                  <option value="">Selecione um livro</option>
                  {livros.map((livro) => (
                    <option key={livro.id} value={livro.id}>
                      {livro.titulo} — {livro.autor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Prazo de Devolução</label>
                <input
                  type="date"
                  value={dataDevolucaoPrevista}
                  onChange={(e) => setDataDevolucaoPrevista(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Concluir Empréstimo
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Devolução */}
      {emprestimoParaDevolver && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={confirmarDevolucao} style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e3a8a' }}>Registrar Devolução</h3>
            <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.9rem' }}>
              {emprestimoParaDevolver.livro?.titulo || `Livro #${emprestimoParaDevolver.livro_id}`}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Data da Devolução</label>
                <input
                  type="date"
                  value={dataDevolucao}
                  onChange={(e) => setDataDevolucao(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEmprestimoParaDevolver(null)}
                  style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Confirmar Devolução
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}