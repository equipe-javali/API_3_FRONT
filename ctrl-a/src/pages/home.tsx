import React, { useState } from 'react';
import './css/home.css';
import logo from '../assets/icons/logo.png';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar se a senha está visível

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      // Redirecionar para a página de ativos
      window.location.href = '/ListaAtivos';
    } else {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <header className="home-header">
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <div className="home-content">
        <div className="home-left-content">
          <p className="home-slogan">Dê um Ctrl A e controle seus ativos com facilidade!</p>
        </div>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form>
          <div className="form-group">
            <label htmlFor="username">Usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </span>
            </div>
          </div>
          <button type="button" onClick={handleLogin}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Home;