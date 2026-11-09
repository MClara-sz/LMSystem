import React, { useState } from 'react';
import './Auth.css'; // Importa o teu CSS puro

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // URL base da sua API do Laravel
  const API_URL = 'http://127.0.0.1:8000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // --- Requisição de Login ---
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao fazer login.');
        }

        // Salva o token do Sanctum e os dados do usuário no navegador
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('Utilizador logado com sucesso:', data.user);
        
        // Redireciona diretamente para a página de livros sem mostrar alerta
        window.location.href = '/livros';

      } else {
        // --- Validação e Requisição de Cadastro ---
        if (password !== confirmPassword) {
          alert('As senhas não coincidem!'); // Mantido apenas para validação visual rápida de erro de digitação
          return;
        }

        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Trata erros de validação do Laravel (ex: e-mail já existente)
          const errorMessage = data.errors 
            ? Object.values(data.errors)[0][0] 
            : data.message;
          throw new Error(errorMessage || 'Erro ao criar conta.');
        }

        // Salva o token gerado logo no cadastro
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('Utilizador registado com sucesso:', data.user);
        
        // Redireciona diretamente para a página de livros após cadastrar
        window.location.href = '/livros';
      }
    } catch (error) {
      alert('Erro: ' + error.message); // Mantido no catch para avisar caso ocorra algum erro na API
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
              minLength={6}
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