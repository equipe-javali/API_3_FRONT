import { useState } from 'react';
import './css/home.css';
import logo from '../assets/icons/logo.png';
import RespostaSistema from '../components/respostaSistema';
import { Link } from 'react-router-dom';

export default function Home() {
  const [textoResposta, setTextoResposta] = useState('')
  const [tipoResposta, setTipoResposta] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar se a senha está visível
  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      fetch("http://localhost:8080/login/signin", {
        method: "POST",
        body: JSON.stringify({
          "email": email,
          "senha": password
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      })
        .then((response => response.json().then(response => {
          if (response.status === 202) {
            localStorage.setItem("token", `${response.data.token}`)
            window.location.href = '/ListaAtivos';
          }
          else {
            setTextoResposta(`Não foi possível realizar o login! Erro:${response.status}`)
            setTipoResposta("Erro")
          }
        })))
        .catch((error) => {
          setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
          setTipoResposta("Erro")
        })
    } catch (error) {
      setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
      setTipoResposta("Erro")
    }
  }
  function fechaPopUp() {
    setTextoResposta('')
    setTipoResposta('')
  }
  return (
    <div className='DivHome'>
      <RespostaSistema tipoResposta={tipoResposta} textoResposta={textoResposta} onClose={fechaPopUp} />
      <header id="header-component">
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <div className="home-content">
        <div className="home-left-content">
          <p className="home-slogan">Dê um Ctrl A e controle seus ativos com facilidade!</p>
        </div>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Usuário:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <input type="submit" placeholder='Entrar' />
          <p className='pergunta'>ou <br /> Não possui cadastro ainda?</p>
          <Link className='linkCadastrar' to={'/CadastroUsuarioAdm'}>Cadastre-se!</Link>
        </form>
      </div>
    </div>
  );
};