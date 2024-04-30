import { FormEvent, useState } from "react";
import './css/cadastrarUsuarioAdm.css';

export default function CriarUsuarioAdm() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [departamento, setDepartamento] = useState('');
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

  const handleDepartamentoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartamento(event.target.value);
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


  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      alert('As senhas não correspondem!');
      return;
    }

    const data = {
      nome,
      cpf,
      nascimento,
      departamento,
      email,
      telefone,
      senha,
      confirmarSenha
    };

    try {
      console.log(data);
      const response = await fetch('http://localhost:8080/usuario/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setAviso("Usuário cadastrado com sucesso!")
      } else {
        console.error('Falha ao cadastrar usuário.');
        const responseData = await response.json();
        console.log(responseData);
      }
    } catch (error) {
      console.error('Erro ao processar requisição:', error);
    }
  };

  return (
    <div className="cadastroUsuário">
      <div>
        <h2>Cadastrar Administrador</h2>
      </div>
      <div className="primeira-parte">
        <div>
          <label>Nome Completo: *</label>
          <input type="text" value={nome} onChange={handleNomeChange} required />
        </div>
        <div>
        <div>
          <label>Data de Nascimento: *</label>
          <input type="date" value={nascimento} onChange={handleNascimentoChange} required />
        </div>
          <label>CPF: *</label>
          <input type="text" value={cpf} onChange={handleCPFChange} required />
        </div>
        <div>
          <label>Telefone:</label>
          <input type="text" value={telefone} onChange={handleTelefoneChange} />
        </div>
        <div>
          <label>Email: *</label>
          <input type="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label>Senha: *</label>
          <input type="password" value={senha} onChange={handleSenhaChange} required />
        </div>
        <div>
          <label>Confirme a senha: *</label>
          <input type="password" value={confirmarSenha} onChange={handleConfirmarSenhaChange} required />
        </div>
        <div>
          <label>Departamento: </label>
          <select value={departamento} onChange={handleDepartamentoChange}>
            <option value="">Selecione...</option>
            <option value="Departamento 1">Departamento 1</option>
            <option value="Departamento 2">Departamento 2</option>
          </select>
        </div>
        <button onClick={handleSubmit}>Cadastre-se</button>
        <h1>* Campo de preenchimento obrigatório.</h1>
        {aviso !== '' &&
          <div>{aviso}</div>
        }
      </div>
    </div>
  );
}
