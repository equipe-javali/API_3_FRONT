import { FormEvent, useState } from "react";
import './css/criarUsuario.css';

export default function CriarUsuario() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value);
  };

  const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(event.target.value);
  };

  const handleDataNascimentoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataNascimento(event.target.value);
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


  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = {
      nome,
      cpf,
      dataNascimento,
      departamento,
      email,
      telefone
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
        console.log('Usuário cadastrado com sucesso!');
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
        <h2>Cadastrar usuário</h2>
      </div>
      <div className="primeira-parte">
        <div>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={handleNomeChange} />
        </div>
        <div>
          <label>CPF:</label>
          <input type="text" value={cpf} onChange={handleCPFChange} />
        </div>
        <div>
          <label>Data de Nascimento:</label>
          <input type="date" value={dataNascimento} onChange={handleDataNascimentoChange} />
        </div>
        <div>
          <label>Telefone:</label>
          <input type="text" value={telefone} onChange={handleTelefoneChange} />
        </div>
        <div>
          <label>Departamento:</label>
          <select value={departamento} onChange={handleDepartamentoChange}>
            <option value="">Selecione...</option>
            <option value="Departamento 1">Departamento 1</option>
            <option value="Departamento 2">Departamento 2</option>
          </select>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <button onClick={handleSubmit}>Cadastrar</button>
      </div>
    </div>
  );
}
