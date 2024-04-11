import { FormEvent, useState } from "react";
import './css/criarUsuario.css';

export default function CriarUsuario() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [usuario, setUsuario] = useState(false);
  const [administrador, setAdministrador] = useState(false);

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

  const handleUsuarioChange = () => {
    setUsuario(true);
    setAdministrador(false);
  };

  const handleAdministradorChange = () => {
    setAdministrador(true);
    setUsuario(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = {
      nome,
      cpf,
      dataNascimento,
      departamento,
      email,
      telefone,
      usuario,
      administrador
    };

    try {
      const response = await fetch('https://javali.supabase.co/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': '<sua-api-key>'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Usuário cadastrado com sucesso!');
      } else {
        console.error('Falha ao cadastrar usuário.');
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
        <div>
          <label>Permissão:</label>
          <div className="nome">
            <label><span>Usuário</span></label>
            <input type="checkbox" checked={usuario} onChange={handleUsuarioChange} className="checkbox-personalizado" id="checkbox-usuario" />
          </div>
          <div className="nome">
            <label><span>Administrador</span></label>
            <input type="checkbox" checked={administrador} onChange={handleAdministradorChange} className="checkbox-personalizado" id="checkbox-administrador" />
          </div>
        </div>
        <button onClick={handleSubmit}>Cadastrar</button>
      </div>
    </div>
  );
}