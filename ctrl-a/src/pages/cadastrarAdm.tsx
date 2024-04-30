import React, { FormEvent, useState } from "react";
import './css/cadastrarUsuarioAdm.css';

export default function CriarUsuarioAdm() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
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
    setEmail(event.target.value);
  };

  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(event.target.value);
  };

  const handleSenhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(event.target.value);
  };

  const handleConfirmarSenhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(event.target.value);
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (senha !== confirmarSenha) {
      alert('As senhas não correspondem!');
      return;
    }
  
    const userData = {
      nome,
      cpf,
      nascimento,
      email,
      telefone,
      status: 'ativo'
    };
  
    try {
      const userResponse = await fetch('http://localhost:8080/usuario/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        });
  
        if (loginResponse.ok) {
          setAviso("Usuário cadastrado com sucesso!");
        } else {
          console.error('Falha ao cadastrar login do usuário');
          const loginResponseData = await loginResponse.json();
          console.log(loginResponseData);
        }
      } else {
        console.error('Falha ao cadastrar usuário');
        const userResponseData = await userResponse.json();
        console.log(userResponseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Nome Completo: *</label>
        <input type="text" value={nome} onChange={handleNomeChange} required />
        <label>Data de Nascimento: *</label>
        <input type="date" value={nascimento} onChange={handleNascimentoChange} required />
        <label>CPF: *</label>
        <input type="text" value={cpf} onChange={handleCPFChange} required />
        <label>Telefone: </label>
        <input type="text" value={telefone} onChange={handleTelefoneChange} required />
        <label>Email: *</label>
        <input type="email" value={email} onChange={handleEmailChange} required />
        <label>Senha: *</label>
        <input type="password" value={senha} onChange={handleSenhaChange} required />
        <label>Confirme a senha: *</label>
        <input type="password" value={confirmarSenha} onChange={handleConfirmarSenhaChange} required />
    
        <button type="submit">Cadastre-se</button>
        <p>Campo de preenchimento obrigatório.</p>
        {aviso !== '' && <p>{aviso}</p>}
      </form>
    </div>
  );
}