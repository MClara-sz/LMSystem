import React, { useState, useEffect } from 'react';

export default function Perfil() {
  // Estado para armazenar os dados do utilizador carregados do localStorage
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'Utilizador'
  });

  // Estados para simular a edição do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setNome(parsed.name || '');
        setEmail(parsed.email || '');
      } catch (e) {
        console.error("Erro ao carregar utilizador", e);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação visual de salvamento
    setMensagemSucesso(true);
    setTimeout(() => setMensagemSucesso(false), 3000);
  };

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Cabeçalho do Perfil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
          {nome ? nome.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#1e3a8a', fontWeight: 'bold', margin: 0 }}>{nome || 'Utilizador'}</h2>
          <p style={{ color: '#6b7280', margin: '0.3rem 0' }}>{email || 'email@exemplo.com'}</p>
          <span style={{ display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
            {user.role === 'admin' ? 'Administrador' : 'Utilizador Comum'}
          </span>
        </div>
      </div>

      {/* Mensagem de sucesso simulada */}
      {mensagemSucesso && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500', border: '1px solid #bbf7d0' }}>
          ✓ Alterações guardadas com sucesso! (Modo Visual)
        </div>
      )}

      {/* Grid com Formulários e Informações */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Formulário Principal */}
        <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Informações Pessoais e Segurança
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Nome Completo</label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none' }} 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Endereço de E-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none' }} 
              />
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#334155', marginBottom: '1rem' }}>Alterar Palavra-passe</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Palavra-passe Atual</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none' }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Nova Palavra-passe</label>
                  <input 
                    type="password" 
                    placeholder="Deixe em branco para não alterar"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none' }} 
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button 
                type="submit" 
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              >
                Guardar Alterações
              </button>
            </div>
          </form>
        </div>

        {/* Painel Lateral de Estatísticas da Conta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '1rem' }}>Resumo da Conta</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#64748b', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Livros Ativos:</span>
                <strong style={{ color: '#1e293b' }}>3</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Histórico Total:</span>
                <strong style={{ color: '#1e293b' }}>12</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Membro desde:</span>
                <strong style={{ color: '#1e293b' }}>2026</strong>
              </li>
            </ul>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '1.5rem', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#1e40af', marginBottom: '0.5rem' }}>Dica da Biblioteca</h4>
            <p style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.4', margin: 0 }}>
              Mantenha o seu e-mail atualizado para receber notificações automáticas sobre prazos de devolução dos seus livros.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}