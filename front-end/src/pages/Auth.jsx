import React, { useState } from 'react';
import './Auth.css'; // Importa o teu CSS puro

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      console.log('A fazer login com:', email, password);
      // Aqui colocas a lógica de requisição para a API de login
    } else {
      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      console.log('A registar utilizador com:', name, email, password);
      // Aqui colocas a lógica de requisição para a API de registo
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">
          📚
        </div> 
        <h1 className="auth-title">
          {isLogin ? 'Entrar na Biblioteca' : 'Criar Conta'}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Campo Nome (exibido apenas no cadastro) */}
          {!isLogin && (
            <div className="auth-group">
              <label>Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo" 
                required
              />
            </div>
          )}

          <div className="auth-group">
            <label>E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com" 
              required
            />
          </div>

          <div className="auth-group">
            <label>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********" 
              required
            />
          </div>

          {/* Campo Confirmar Senha (exibido apenas no cadastro) */}
          {!isLogin && (
            <div className="auth-group">
              <label>Confirmar Senha</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********" 
                required
              />
            </div>
          )}

          <button type="submit" className="auth-button">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-switch">
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>

      </div>
    </div>
  );
}