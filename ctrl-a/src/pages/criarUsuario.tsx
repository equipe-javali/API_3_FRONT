import { useEffect, useState } from "react";
import './css/criarUsuario.css';
import RespostaSistema from "../components/respostaSistema";
import getLocalToken from "../utils/getLocalToken";
import CampoPadrao from "../components/CampoPadrao";
import CampoData from "../components/CampoData";
import CampoDropdown from "../components/CampoDropdown";

export default function CriarUsuario() {
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
  const [avisoNome, setAvisoNome] = useState<string | undefined>(undefined);
  const campoNome = CampoPadrao(
    "Nome:",
    "text",
    "Insira o nome do usuário",
    "Nome",
    avisoNome
  )

  const [avisoCPF, setAvisoCPF] = useState<string | undefined>(undefined);
  const campoCPF = CampoPadrao(
    "CPF:",
    "text",
    "Insira o cpf do usuário",
    "CPF",
    avisoCPF
  )

  const [avisoTelefone, setAvisoTelefone] = useState<string | undefined>(undefined);
  const campoTelefone = CampoPadrao(
    "Telefone:",
    "text",
    "insira o telefone do usuário",
    "Telefone",
    avisoTelefone
  )

  const [avisoEmail, setAvisoEmail] = useState<string | undefined>(undefined);
  const campoEmail = CampoPadrao(
    "Email:",
    "email",
    "Insira o email do usuário",
    "Email",
    avisoEmail
  )
  const [avisoNascimento, setAvisoNascimento] = useState<string | undefined>(undefined);
  const campoNascimento = CampoData(
    "Data Nascimento:",
    "Nascimento",
    avisoNascimento
  )

  const [avisoDepartamento, setAvisoDepartamento] = useState<string | undefined>(undefined);
  const campoDepartamento = CampoDropdown(
    "Departamento:",
    ["Departamento 1", "Departamento 2"],
    "Escolha um departamento",
    avisoDepartamento
  )

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    let certo = true
    if (campoNome.dado === '' || !campoNome.dado) {
      setAvisoNome("Insira algo no nome!")
      certo = false
    }
    if (campoCPF.dado === '') {
      setAvisoCPF("Insira o cpf!")
      certo = false
    } else if (campoCPF.dado.length !== 14) {
      setAvisoCPF("Insira um cpf válido!")
      certo = false
    }
    if (campoEmail.dado === '') {
      setAvisoEmail("Insira um email!")
      certo = false
    }
    if (campoTelefone.dado === '') {
      setAvisoTelefone("Insira um telefone!")
      certo = false
    } else if (![14, 15].includes(campoTelefone.dado.length)) {
      setAvisoTelefone("Insira um telefone válido!")
      certo = false
    }
    if (campoNascimento.dado === '') {
      setAvisoNascimento("Insira uma data!")
      certo = false
    }
    if (campoDepartamento.dado === '') {
      setAvisoDepartamento("Escolha um departamento!")
      certo = false
    }
    if (certo) {
      const data = {
        "nome": campoNome.dado,
        "cpf": campoCPF.dado.replace(/\D/g, ''),
        "nascimento": campoNascimento.dado,
        "departamento": campoDepartamento.dado,
        "telefone": campoTelefone.dado.replace(/\D/g, ''),
        "email": campoEmail.dado
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
            } else if (response.status === 400) {
              setAvisoEmail("Email já cadastrado!")
            } else {
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
    }
  };

  return (
    <div className="cadastroUsuário">
      <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
      <h2>Cadastrar usuário</h2>
      <form
        onSubmit={handleSubmit}
        className="FormsCadastroUsuario"
      >
        <div className="primeira-parte">
          {campoNome.codigo}
          {campoCPF.codigo}
          {campoTelefone.codigo}
          {campoEmail.codigo}
          {campoDepartamento.codigo}
          {campoNascimento.codigo}
          <input type="submit" value="Cadastrar" />
        </div>
      </form>
    </div>
  );
}
