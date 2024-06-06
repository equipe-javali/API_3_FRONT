import { FormEvent, useEffect, useState } from "react";
import './css/criarUsuario.css';
import RespostaSistema from "../components/respostaSistema";
import getLocalToken from "../utils/getLocalToken";
import CampoPadrao from "../components/CampoPadrao";
import CampoData from "../components/CampoData";
import CampoDropdown from "../components/CampoDropdown";
import CampoImagem from "../components/CampoImagem";

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
    true,
    avisoNome
  )

  const [avisoCPF, setAvisoCPF] = useState<string | undefined>(undefined);
  const campoCPF = CampoPadrao(
    "CPF:",
    "text",
    "Insira o cpf do usuário",
    "CPF",
    true,
    avisoCPF
  )

  const [avisoTelefone, setAvisoTelefone] = useState<string | undefined>(undefined);
  const campoTelefone = CampoPadrao(
    "Telefone:",
    "text",
    "insira o telefone do usuário",
    "Telefone",
    true,
    avisoTelefone
  )

  const [avisoEmail, setAvisoEmail] = useState<string | undefined>(undefined);
  const campoEmail = CampoPadrao(
    "Email:",
    "email",
    "Insira o email do usuário",
    "Email",
    true,
    avisoEmail
  )
  const [avisoNascimento, setAvisoNascimento] = useState<string | undefined>(undefined);
  const campoNascimento = CampoData(
    "Data Nascimento:",
    "Nascimento",
    "",
    true,
    avisoNascimento
  )

  const [avisoDepartamento, setAvisoDepartamento] = useState<string | undefined>(undefined);
  const campoDepartamento = CampoDropdown(
    "Departamento:",
    ["Departamento 1", "Departamento 2"],
    "",
    "Escolha um departamento",
    true,
    avisoDepartamento
  )

  const campoFotoPerfil = CampoImagem(
    "Foto de Perfil:",
    "Enviar Foto do Perfil",
    10,
    false
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (campoEmail.dado === '') {
      setAvisoEmail("Insira um email!")
      certo = false
    } else if (!emailRegex.test(campoEmail.dado)) {
      setAvisoEmail("Insira um email válido!")
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
    if (campoFotoPerfil.erroCampo) {
      certo = false
    }
    if (certo) {
      const data = {
        "nome": campoNome.dado,
        "cpf": campoCPF.dado.replace(/\D/g, ''),
        "nascimento": campoNascimento.dado,
        "departamento": campoDepartamento.dado,
        "telefone": campoTelefone.dado.replace(/\D/g, ''),
        "email": campoEmail.dado,
        "status": 'ativo',
        "tipoFoto ": campoFotoPerfil.dado.tipoArquivo,
        "dadosFoto": campoFotoPerfil.dado.documento,
      };
      const token = getLocalToken();
      try {
        console.log(data);
        const userResponse = await fetch('http://localhost:8080/usuario/cadastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token
          },
          body: JSON.stringify({
            usuario: data
          })
        })
        if (userResponse.ok) {
          setTextoResposta("Usuário cadastrado com sucesso!")
          setTipoResposta("Sucesso")
          campoCPF.limpar()
          campoDepartamento.limpar()
          campoEmail.limpar()
          campoNascimento.limpar()
          campoNome.limpar()
          campoTelefone.limpar()
          campoFotoPerfil.limpar()
        } else if (userResponse.status === 400) {
          const userResponseData = await userResponse.text();
          if (userResponseData === "O CPF já existe") {
            setAvisoCPF(`${userResponseData}!`)
          } else if (userResponseData === "O e-mail já existe") {
            setAvisoEmail(`${userResponseData}!`)
          }
        } else {
          setTextoResposta(`Não foi possível cadastrar! Erro:${userResponse.status}`)
          setTipoResposta("Erro")
        }
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
          <div>
            <div>
              {campoNome.codigo}
              {campoCPF.codigo}
              {campoTelefone.codigo}
              {campoEmail.codigo}
              {campoDepartamento.codigo}
            </div>
            <div>
              {campoFotoPerfil.codigo}
              {campoNascimento.codigo}
            </div>
          </div>
          <input type="submit" value="Cadastrar" />
        </div>
      </form>
    </div>
  );
}
