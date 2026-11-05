import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      if (isLogin) {
        const response = await api.post('/login', { email, password });
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        setMensagem('Login realizado com sucesso! Redirecionando...');
        
        setTimeout(() => {
          navigate('/livros');
        }, 1000);

      } else {
        const response = await api.post('/register', { 
          name: nome, 
          nome: nome, 
          email, 
          password 
        });
        setMensagem('Cadastro realizado com sucesso! Faça login.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const erroServidor = err.response.data.message || JSON.stringify(err.response.data.errors);
        setMensagem(`Erro: ${erroServidor}`);
      } else {
        setMensagem('Ocorreu um erro ao comunicar com o servidor.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Entrar na Biblioteca' : 'Criar Conta de Visitante'}
        </h1>

        {mensagem && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded text-sm text-center">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome completo"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
}