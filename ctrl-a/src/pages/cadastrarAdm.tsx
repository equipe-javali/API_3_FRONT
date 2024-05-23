import { FormEvent, useState } from "react";
import './css/cadastrarUsuarioAdm.css';
import getLocalToken from "../utils/getLocalToken";
import { Link } from "react-router-dom";
import CampoDropdown from "../components/CampoDropdown";
import CampoData from "../components/CampoData";
import CampoPadrao from "../components/CampoPadrao";
import CampoSenha from "../components/CampoSenha";

export default function CriarUsuarioAdm() {
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
    true,
    avisoNascimento
  )

  const [avisoDepartamento, setAvisoDepartamento] = useState<string | undefined>(undefined);
  const campoDepartamento = CampoDropdown(
    "Departamento:",
    ["Departamento 1", "Departamento 2"],
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
  const [aviso, setAviso] = useState("")

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
    if (certo) {
      const data = {
        "nome": campoNome.dado,
        "cpf": campoCPF.dado.replace(/\D/g, ''),
        "nascimento": campoNascimento.dado,
        "departamento": campoDepartamento.dado,
        "telefone": campoTelefone.dado.replace(/\D/g, ''),
        "email": campoEmail.dado,
        "status": 'ativo',
        "usuariologin": {
          "senha": campoSenha.dado
        }
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
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const { id } = userData;
          const loginData = {
            usuario: {
              id,
            },
            senha: campoSenha.dado
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
            campoCPF.limpar()
            campoDepartamento.limpar()
            campoEmail.limpar()
            campoNascimento.limpar()
            campoNome.limpar()
            campoTelefone.limpar()
            campoSenha.limpar()
          } else {
            console.error('Falha ao cadastrar login do usuário');
            const loginResponseData = await loginResponse.json();
            console.log(loginResponseData);
          }
        } else if (userResponse.status === 400) {
          const userResponseData = await userResponse.text();
          if (userResponseData === "O CPF já existe") {
            setAvisoCPF(`${userResponseData}!`)
          } else if (userResponseData === "O e-mail já existe") {
            setAvisoEmail(`${userResponseData}!`)
          }
        }
        else {
          console.error('Falha ao cadastrar usuário');
          const userResponseData = await userResponse.json();
          console.log(userResponseData);
          setTimeout(() => {
            setAviso('');
          }, 2000);
        }
      } catch (error) {
        console.error(error);
      }
    };
  }

  return (
    <div className="CadastroAdm">
      <form onSubmit={handleSubmit} className="form-cadastro">
        <Link className="retornarLogin" to={'/'}>◀ Voltar</Link>
        <h1 className="titulo">Cadastrar Adm</h1>
        {campoNome.codigo}
        {campoNascimento.codigo}
        {campoCPF.codigo}
        {campoTelefone.codigo}
        {campoEmail.codigo}
        {campoSenha.codigo}
        {campoDepartamento.codigo}
        <input type="submit" value="Cadastrar" />
        <label className="legenda">* Campo de preenchimento obrigatório.</label>
        {aviso !== '' && <p>{aviso}</p>}
      </form>
    </div>
  );
}