import { FormEvent, useEffect, useState } from "react";
import './css/criarUsuario.css';
import RespostaSistema from "../components/respostaSistema";
import getLocalToken from "../utils/getLocalToken";

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


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      nome,
      cpf,
      nascimento,
      departamento,
      email,
      telefone
    };

    const token = getLocalToken();

    try {
      console.log(data);
      fetch('http://localhost:8080/usuario/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token
        },
        body: JSON.stringify({
          usuario: data
        })
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

    setNome('')
    setCpf('')
    setDepartamento('')
    setEmail('')
    setNascimento('')
    setTelefone('')
  };

  return (
    <div className="cadastroUsuário">
      <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
      <div>
        <h2>Cadastrar usuário</h2>
      </div>
      <form onSubmit={handleSubmit} className="primeira-parte">
        <div>
          <label>Nome <span className="inputObrigatorio">*</span></label>
          <input type="text" value={nome} onChange={handleNomeChange} placeholder="Digite o nome do usuário..." required 
          onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe o nome do usuário')}
          onInput={e => e.currentTarget.setCustomValidity('')}/>
        </div>
        <div>
          <label>CPF <span className="inputObrigatorio">*</span></label>
          <input type="text" value={cpf} onChange={handleCPFChange} placeholder="000.000.000-00" required
          onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe o cpf do usuário')}
          onInput={e => e.currentTarget.setCustomValidity('')}/>
        </div>
        <div>
          <label>Data de Nascimento</label>
          <input type="date" value={nascimento} onChange={handleNascimentoChange} />
        </div>
        <div>
          <label>Telefone</label>
          <input type="text" value={telefone} onChange={handleTelefoneChange} placeholder="12981111111"/>
        </div>
        <div>
          <label>Departamento <span className="inputObrigatorio">*</span></label>
          <select value={departamento} onChange={handleDepartamentoChange} required 
          onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe o departamento do usuário')}
          onInput={e => e.currentTarget.setCustomValidity('')}>
            <option value="">Selecione...</option>
            <option value="Departamento 1">Departamento 1</option>
            <option value="Departamento 2">Departamento 2</option>
          </select>
        </div>
        <div>
          <label>Email <span className="inputObrigatorio">*</span></label>
          <input type="email" value={email} onChange={handleEmailChange} required placeholder="exemplo@email.com"
          onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Por favor informe o email do usuário')}
          onInput={e => e.currentTarget.setCustomValidity('')}/>
        </div>
        <p className="inputObrigatorio">* Campo de preenchimento obrigatório</p>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
