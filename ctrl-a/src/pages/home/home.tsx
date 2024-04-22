import React, { useState } from 'react';
import './home.css';
import logo from '';

const Home: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      console.log('Login bem-sucedido!');
    } else {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <header className="header">
        <h1>Ctrl A</h1>
      </header>
      <div className="content">
        <div className="left-content">
          <img src={logo} alt="Logo" className="logo" />
          <p className="slogan">Dê um Ctrl A e controle seus ativos com facilidade!</p>
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
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleLogin}>Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
