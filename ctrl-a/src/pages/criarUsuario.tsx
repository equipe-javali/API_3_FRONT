import { FormEvent, useEffect, useState } from "react";
import './css/criarUsuario.css';
import RespostaSistema from "../components/respostaSistema";

export default function CriarUsuario() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [textoResposta, setTextoResposta] = useState('')
  const [tipoResposta, setTipoResposta] = useState('')
  function fechaPopUp() {
    setTextoResposta('')
    setTipoResposta('')
  }
  useEffect(() => {
    if (tipoResposta === "Sucesso") {
      const timer = setTimeout(() => {
        fechaPopUp();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [tipoResposta]);

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


  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = {
      nome,
      cpf,
      nascimento,
      departamento,
      email,
      telefone
    };

    try {
      console.log(data);
      fetch('http://localhost:8080/usuario/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (response.ok) {
            setTextoResposta("Usuário cadastrado com sucesso!")
            setTipoResposta("Sucesso")
          }
          else {
            setTextoResposta(`Não foi possível cadastrar! Erro:${response.status}`)
            setTipoResposta("Erro")
          }
        })
        .catch((error) => {
          setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
          setTipoResposta("Erro")
        })
    } catch (error) {
      setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
      setTipoResposta("Erro")
    }
  };

  return (
    <div className="cadastroUsuário">
      <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
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
          <input type="date" value={nascimento} onChange={handleNascimentoChange} />
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
