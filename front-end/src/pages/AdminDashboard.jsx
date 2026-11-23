import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [livros, setLivros] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    let autorizado = false;

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'admin') {
          autorizado = true;
          setIsAdmin(true);
        }
      } catch (e) {
        console.error('Erro ao verificar permissões', e);
      }
    }

    if (!autorizado) {
      setLoading(false);
      return;
    }

    const carregarDados = async () => {
      try {
        const [resLivros, resEmprestimos] = await Promise.all([
          api.get('/livros'),
          api.get('/emprestimos'),
        ]);

        const listaLivros = Array.isArray(resLivros.data)
          ? resLivros.data
          : resLivros.data.livros || [];

        const listaEmprestimos = Array.isArray(resEmprestimos.data)
          ? resEmprestimos.data
          : resEmprestimos.data.emprestimos || [];

        setLivros(listaLivros);
        setEmprestimos(listaEmprestimos);
      } catch (err) {
        console.error('Erro ao carregar dados do painel:', err);
        setErro('Não foi possível carregar os dados da biblioteca.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>A carregar painel...</div>;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            margin: '0 auto',
            border: '1px solid #fecaca',
          }}
        >
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Acesso Restrito 🚫</h2>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            Esta página é exclusiva para administradores do sistema de biblioteca.
          </p>
        </div>
      </div>
    );
  }

  const hojeStr = new Date().toISOString().split('T')[0];

  const ativos = emprestimos.filter(
    (item) => item.situacao !== 'devolvido' && item.status !== 'devolvido'
  );

  const devolvidos = emprestimos.filter(
    (item) => item.situacao === 'devolvido' || item.status === 'devolvido'
  );

  const atrasados = ativos.filter(
    (item) => item.data_devolucao_prevista && item.data_devolucao_prevista < hojeStr
  );

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e3a8a', fontWeight: 'bold', margin: 0 }}>
            Painel do Administrador
          </h2>
          <p style={{ color: '#6b7280', margin: '0.4rem 0 0 0' }}>
            Visão geral do acervo, empréstimos ativos e prazos de devolução.
          </p>
        </div>
        <span
          style={{
            background: '#fef08a',
            color: '#713f12',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
          }}
        >
          Modo Administrador Ativo 🛡️
        </span>
      </div>

      {erro && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.9rem 1.2rem',
            background: '#fef2f2',
            color: '#991b1b',
            borderRadius: '8px',
          }}
        >
          {erro}
        </div>
      )}

      {/* Indicadores */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #2563eb' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Livros no Acervo</span>
          <h3 style={{ fontSize: '1.8rem', color: '#111827', margin: '0.5rem 0 0 0' }}>{livros.length}</h3>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Empréstimos Ativos</span>
          <h3 style={{ fontSize: '1.8rem', color: '#d97706', margin: '0.5rem 0 0 0' }}>{ativos.length}</h3>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #ef4444' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Devoluções Atrasadas</span>
          <h3 style={{ fontSize: '1.8rem', color: '#dc2626', margin: '0.5rem 0 0 0' }}>{atrasados.length}</h3>
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Devoluções Concluídas</span>
          <h3 style={{ fontSize: '1.8rem', color: '#059669', margin: '0.5rem 0 0 0' }}>{devolvidos.length}</h3>
        </div>
      </div>

      {/* Conteúdo principal: Empréstimos ativos e Ações */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#1e293b', margin: '0 0 1rem 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Empréstimos Ativos / Prazos
          </h3>

          {ativos.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              Nenhum empréstimo ativo no momento.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ativos.slice(0, 5).map((item) => {
                const estaAtrasado =
                  item.data_devolucao_prevista && item.data_devolucao_prevista < hojeStr;

                return (
                  <li
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '0.6rem',
                      borderBottom: '1px solid #f8fafc',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#1e293b' }}>
                        {item.livro?.titulo || `Livro #${item.livro_id}`}
                      </strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Prevista: {item.data_devolucao_prevista || '-'}
                      </div>
                    </div>

                    <span
                      style={{
                        background: estaAtrasado ? '#fee2e2' : '#dcfce7',
                        color: estaAtrasado ? '#991b1b' : '#166534',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {estaAtrasado ? 'Atrasado' : 'No prazo'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#1e293b', margin: '0 0 1rem 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Ações Rápidas
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <button
              type="button"
              onClick={() => navigate('/livros')}
              style={{
                background: '#f8fafc',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                padding: '0.75rem',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📚 Gerenciar Acervo e Cadastrar Livros
            </button>

            <button
              type="button"
              onClick={() => navigate('/emprestimos')}
              style={{
                background: '#f8fafc',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                padding: '0.75rem',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🔄 Gerenciar Empréstimos e Devoluções
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              style={{
                background: '#f8fafc',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                padding: '0.75rem',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🖨️ Imprimir Resumo do Painel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}