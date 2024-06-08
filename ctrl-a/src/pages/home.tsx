import { useState } from 'react';
import './css/home.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logoHome from '../assets/icons/logoHome.jpeg';
import RespostaSistema from '../components/respostaSistema';
import { Link } from 'react-router-dom';

export default function Home() {
  const [textoResposta, setTextoResposta] = useState('')
  const [tipoResposta, setTipoResposta] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const response = await fetch("http://localhost:8080/login/signin", {
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
      });
      const responseData = await response.json();
      if (response.status === 202) {
        localStorage.clear()
        localStorage.setItem("token", `${responseData.token}`)
        localStorage.setItem("id", `${responseData.usuario.id}`)
        window.location.href = '/ListaAtivos';
      }
      else {
        setTextoResposta(`Não foi possível realizar o login! Erro:${response.status}`)
        setTipoResposta("Erro")
      }
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
    <div className='divHome'>
      <RespostaSistema tipoResposta={tipoResposta} textoResposta={textoResposta} onClose={fechaPopUp} />
      <div>
        <div>
          <img src={logoHome} alt="Logo-Home" />
          <p className="home-slogan">Dê um Ctrl A e controle seus ativos com facilidade! </p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className='formLogin'>
            <h1>Login</h1>
            <div className='divEmailLogin'>
              <span> Email do Usuário:</span>
              <input
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='divSenhaLogin'>
              <span> Senha</span>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? <FaEyeSlash onClick={() => setShowPassword(!showPassword)} /> : <FaEye onClick={() => setShowPassword(!showPassword)} />}
              </div>
            </div>
            <Link className='pergunta-esqueci' to={'/RedefinirSenha'}>Esqueci minha senha</Link>
            <input
              className='botaoLogin'
              type='submit'
              value='Entrar'
            />
            <p className='pergunta'>
              Não possui cadastro ainda?{' '}
              <span>&nbsp;</span>
              <Link className='linkCadastro' to={'/CadastroUsuarioAdm'}> Cadastre-se!</Link>              
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};