import { FormEvent, useEffect, useState } from "react";
import './css/cadastrarUsuarioAdm.css';
import { Link } from "react-router-dom";
import CampoDropdown from "../components/CampoDropdown";
import CampoData from "../components/CampoData";
import CampoPadrao from "../components/CampoPadrao";
import CampoSenha from "../components/CampoSenha";
import RespostaSistema from "../components/respostaSistema";
import CampoImagem from "../components/CampoImagem";

export default function CriarUsuarioAdm() {
  const [textoResposta, setTextoResposta] = useState('');
  const [tipoResposta, setTipoResposta] = useState('');
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

  const [avisoSenha, setAvisoSenha] = useState<string | undefined>(undefined);
  const campoSenha = CampoSenha(
    "Senha:",
    "Insira a senha",
    true,
    avisoSenha
  )

  const campoFotoPerfil = CampoImagem(
    "Foto de Perfil:",
    "Enviar Foto do Perfil",
    10,
    false
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    if (campoSenha.dado === '') {
      setAvisoSenha("Insira uma senha!")
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
        tipoFoto: campoFotoPerfil.dado.tipoArquivo,
        dadosFoto: campoFotoPerfil.dado.documento,
        "usuariologin": {
          "senha": campoSenha.dado
        }
      };
      try {
        console.log(data);
        const userResponse = await fetch('http://localhost:8080/usuario/cadastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: data
          })
        });
        if (userResponse.status === 201) {
          setTextoResposta("Usuário cadastrado com sucesso!")
          setTipoResposta("Sucesso")
          campoCPF.limpar()
          campoDepartamento.limpar()
          campoEmail.limpar()
          campoNascimento.limpar()
          campoNome.limpar()
          campoTelefone.limpar()
          campoSenha.limpar()
          campoFotoPerfil.limpar()
        } else if (userResponse.status === 400) {
          const userResponseData = await userResponse.text();
          if (userResponseData === "O CPF já existe") {
            setAvisoCPF(`${userResponseData}!`)
          } else if (userResponseData === "O e-mail já existe") {
            setAvisoEmail(`${userResponseData}!`)
          }
        } else {
          setTextoResposta(`Erro ao cadastrar usuario! Erro:${userResponse.status}`);
          setTipoResposta('Erro');
        }
      } catch (error) {
        setTextoResposta(`Erro ao processar requisição! Erro:${error}`);
        setTipoResposta("Erro");
      }
    };
  }

  return (
    <div className="CadastroAdm">
      <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
      <form onSubmit={handleSubmit} className="form-cadastro">
        <Link className="retornarLogin" to={'/'}>◀ Voltar</Link>
        <h1 className="titulo">Cadastrar Adm</h1>
        <div className="divFormsCadastroAdm">
          <div>
            {campoNome.codigo}
            {campoNascimento.codigo}
            {campoCPF.codigo}
            {campoTelefone.codigo}
            {campoSenha.codigo}
          </div>
          <div>
            {campoFotoPerfil.codigo}
            {campoEmail.codigo}
            {campoDepartamento.codigo}
          </div>
        </div>
        <input type="submit" value="Cadastrar" />
        <label className="legenda">* Campo de preenchimento obrigatório.</label>
      </form>
    </div>
  );
}