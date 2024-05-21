import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './css/cadastrarUsuarioAdm.css';
import getLocalToken from "../utils/getLocalToken";
import { Link } from "react-router-dom";

export default function CriarUsuarioAdm() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [departamento, setDepartamento] = useState('');
  const [aviso, setAviso] = useState("")

  const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value);
  };

  const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(event.target.value);
  };

  const handleNascimentoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNascimento(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setEmail(email);
  };

  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(event.target.value);
  };

  const handleSenhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      console.log('Email inválido');
      return;
    }

    const userData = {
      nome,
      cpf,
      nascimento,
      departamento,
      email,
      telefone,
      status: 'ativo',
      usuariologin: {
        senha: senha
      }
    };

    const token = getLocalToken();

    try {
      const userResponse = await fetch('http://localhost:8080/usuario/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token
        },
        body: JSON.stringify({
          usuario: userData
        })
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const { id } = userData;

        const loginData = {
          usuario: {
            id,
          },
          senha
        };

        const loginResponse = await fetch('http://localhost:8080/usuarioLogin/cadastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          },
          body: JSON.stringify(loginData)
        });

        if (loginResponse.ok) {
          setAviso("Usuário cadastrado com sucesso!");
          setTimeout(() => {
            setAviso('');
          }, 2000);

        } else {
          console.error('Falha ao cadastrar login do usuário');
          const loginResponseData = await loginResponse.json();
          console.log(loginResponseData);
        }
      } else {
        console.error('Falha ao cadastrar usuário');
        const userResponseData = await userResponse.json();
        console.log(userResponseData);
        setAviso("Falha ao cadastrar usuário!");
        setTimeout(() => {
          setAviso('');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }

    setNome('');
    setCpf('');
    setNascimento('');
    setDepartamento('');
    setEmail('');
    setTelefone('');
    setSenha('');
  };

  return (
    <div className="CadastroAdm">
      <form onSubmit={handleSubmit} className="form-cadastro">
        <Link className="retornarLogin" to={'/'}>◀ Voltar</Link>
        <h1 className="titulo">Cadastrar Administrador</h1>
        <label>Nome <span className="inputObrigatorio">*</span></label>
        <input type="text" value={nome} onChange={handleNomeChange} required placeholder="Digite seu nome..."
        onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe o seu nome')}
        onInput={e => e.currentTarget.setCustomValidity('')}/>

        <label>Data de Nascimento </label>
        <input type="date" value={nascimento} onChange={handleNascimentoChange}/>

        <label>CPF <span className="inputObrigatorio">*</span></label>
        <input type="text" value={cpf} onChange={handleCPFChange} required placeholder="000.000.000-00"
        onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe o seu cpf')}
        onInput={e => e.currentTarget.setCustomValidity('')}/>

        <label>Telefone </label>
        <input type="text" value={telefone} onChange={handleTelefoneChange} placeholder="12980000000"/>

        <label>E-mail <span className="inputObrigatorio">*</span></label>
        <input type="email" value={email} onChange={handleEmailChange} required placeholder="teste@email.com"
        onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe o seu email')}
        onInput={e => e.currentTarget.setCustomValidity('')}/>

        <label>Senha <span className="inputObrigatorio">*</span></label>
        <div className="input-container">
          <input type={showPassword ? "text" : "password"} value={senha} onChange={handleSenhaChange} required placeholder="Digite sua senha..."
          onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe a sua senha')}
          onInput={e => e.currentTarget.setCustomValidity('')}/>
          {showPassword ? <FaEyeSlash className="password-icon" onClick={() => setShowPassword(!showPassword)} /> : <FaEye className="password-icon" onClick={() => setShowPassword(!showPassword)} />}
        </div>

        <label>Departamento <span className="inputObrigatorio">*</span></label>
        <select name="departamento" value={departamento} onChange={event => setDepartamento(event.target.value)} required
        onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe o seu departamento')}
        onInput={e => e.currentTarget.setCustomValidity('')}>
          <option value="">Selecione o departamento...</option>
          <option value="Departamento 1">Departamento 1</option>
          <option value="Departamento 2">Departamento 2</option>
        </select>

        <button type="submit">Cadastrar</button>
        <label className="legenda inputObrigatorio">* Campo de preenchimento obrigatório.</label>
        {aviso !== '' && <p>{aviso}</p>}
      </form>
    </div>
  );
}