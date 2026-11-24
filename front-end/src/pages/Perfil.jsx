import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Perfil() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'Utilizador',
    created_at: null,
  });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [livrosAtivos, setLivrosAtivos] = useState(0);
  const [historicoTotal, setHistoricoTotal] = useState(0);
  const [carregandoResumo, setCarregandoResumo] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setNome(parsed.name || '');
        setEmail(parsed.email || '');
      } catch (e) {
        console.error('Erro ao carregar utilizador', e);
      }
    }
  }, []);

  useEffect(() => {
    const carregarResumoEmprestimos = async () => {
      if (!localStorage.getItem('token')) {
        setCarregandoResumo(false);
        return;
      }

      try {
        const res = await api.get('/emprestimos');
        const lista = Array.isArray(res.data)
          ? res.data
          : res.data.emprestimos || [];

        const ativos = lista.filter(
          (item) => item.situacao !== 'devolvido' && item.status !== 'devolvido'
        );

        setLivrosAtivos(ativos.length);
        setHistoricoTotal(lista.length);
      } catch (err) {
        console.error('Erro ao carregar resumo de empréstimos:', err);
      } finally {
        setCarregandoResumo(false);
      }
    };

    carregarResumoEmprestimos();
  }, []);

  const anoMembroDesde = user?.created_at
    ? new Date(user.created_at).getFullYear()
    : new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemSucesso('');
    setMensagemErro('');
    setSalvando(true);

    try {
      const payload = {
        name: nome,
        email,
      };

      if (novaSenha.trim() !== '') {
        payload.senha_atual = senhaAtual;
        payload.nova_senha = novaSenha;
      }

      const res = await api.put('/perfil', payload);
      const usuarioAtualizado = res.data?.user || { ...user, name: nome, email };

      localStorage.setItem('user', JSON.stringify(usuarioAtualizado));
      setUser(usuarioAtualizado);
      setNome(usuarioAtualizado.name || nome);
      setEmail(usuarioAtualizado.email || email);
      setSenhaAtual('');
      setNovaSenha('');
      setMensagemSucesso(res.data?.message || 'Alterações guardadas com sucesso!');
      setTimeout(() => setMensagemSucesso(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      const msgApi =
        err.response?.data?.message ||
        'Não foi possível guardar as alterações. Verifique os campos.';
      setMensagemErro(msgApi);
    } finally {
      setSalvando(false);
    }
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

      {/* Mensagem de sucesso ou erro */}
      {mensagemSucesso && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500', border: '1px solid #bbf7d0' }}>
          ✓ {mensagemSucesso}
        </div>
      )}

      {mensagemErro && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500', border: '1px solid #fecaca' }}>
          {mensagemErro}
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
                required
                style={{ width: '100%', padding: '0.7rem', marginTop: '0.3rem', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Endereço de E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                disabled={salvando}
                style={{
                  background: salvando ? '#93c5fd' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: salvando ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {salvando ? 'A guardar...' : 'Guardar Alterações'}
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
                <strong style={{ color: '#1e293b' }}>
                  {carregandoResumo ? '...' : livrosAtivos}
                </strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Histórico Total:</span>
                <strong style={{ color: '#1e293b' }}>
                  {carregandoResumo ? '...' : historicoTotal}
                </strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Membro desde:</span>
                <strong style={{ color: '#1e293b' }}>{anoMembroDesde}</strong>
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