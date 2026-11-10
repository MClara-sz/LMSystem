import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verifica se o role é admin
        if (parsedUser.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Erro ao verificar permissões", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>A carregar painel...</div>;
  }

  // Se não for admin, mostra um aviso de acesso negado
  if (!isAdmin) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '2rem', borderRadius: '12px', maxWidth: '500px', margin: '0 auto', border: '1px solid #fecaca' }}>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Acesso Restrito 🚫</h2>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>Esta página é exclusiva para administradores do sistema de biblioteca.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Cabeçalho do Painel Admin */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e3a8a', fontWeight: 'bold', margin: 0 }}>Painel do Administrador</h2>
          <p style={{ color: '#6b7280', margin: '0.4rem 0 0 0' }}>Gestão centralizada de utilizadores, acervo e estatísticas da biblioteca.</p>
        </div>
        <span style={{ background: '#fef08a', color: '#713f12', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          Modo Administrador Ativo 🛡️
        </span>
      </div>

      {/* Cartões de Estatísticas Globais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #2563eb' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total de Livros no Acervo</span>
          <h3 style={{ fontSize: '1.8rem', color: '#111827', margin: '0.5rem 0 0 0' }}>42</h3>
        </div>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Utilizadores Registados</span>
          <h3 style={{ fontSize: '1.8rem', color: '#10b981', margin: '0.5rem 0 0 0' }}>12</h3>
        </div>
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Empréstimos Ativos</span>
          <h3 style={{ fontSize: '1.8rem', color: '#f59e0b', margin: '0.5rem 0 0 0' }}>5</h3>
        </div>
      </div>

      {/* Secções de Ações Administrativas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Gestão Rápida de Utilizadores */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Utilizadores Recentes
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f8fafc' }}>
              <div>
                <strong>Maria Clara</strong><br />
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>maria@email.com</span>
              </div>
              <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>Admin</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <div>
                <strong>João Silva</strong><br />
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>joao@email.com</span>
              </div>
              <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>Utilizador</span>
            </li>
          </ul>
        </div>

        {/* Ferramentas do Sistema */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Ações Administrativas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <button style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }}>
              ➕ Adicionar Novo Livro ao Acervo Global
            </button>
            <button style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }}>
              📊 Gerar Relatório de Empréstimos em PDF
            </button>
            <button style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '8px', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }}>
              ⚙️ Configurações da Biblioteca
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}