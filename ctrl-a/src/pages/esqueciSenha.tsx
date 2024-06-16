import { FormEvent, useEffect, useState } from "react";
import './css/esqueciSenha.css';
import getLocalToken from "../utils/getLocalToken";
import { Link } from "react-router-dom";
import CampoPadrao from "../components/CampoPadrao";

interface Ativo {
    id: number;
    nome: string;
  }
  
  interface UsuarioLogin {
    id: number;
    senha: string;
  }

interface Usuario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    nascimento: string;
    departamento: string;
    telefone: string;
    status: string; // Status como string
    ativos: Ativo[];
    usuariologin: UsuarioLogin;
  }

export default function EsqueciSenha() {
    const [avisoEmail, setAvisoEmail] = useState<string | undefined>(undefined);
    const campoEmail = CampoPadrao(
        "Seu email de acesso:",
        "email",
        "Insira o email do usuário",
        "Email",
        false,
        avisoEmail
    )

    const [aviso, setAviso] = useState("")
    // const [usuarios, setUsuarios] = useState<Usuario[]>([])

    // useEffect(() => {
    //     const listagemUsuarios = async () => {
    //         try {
    //             const reqData = await fetch("http://localhost:8080/usuario/listagemTodosAdm",
    //                 { method: "GET", headers: { Authorization: getLocalToken() } }
    //             )
    //             if (!reqData.ok) {
    //                 const erroData = await reqData.json()
    //                 throw new Error(
    //                     `Erro na listagem de usuários: ${reqData.status} ${reqData.statusText} - ${erroData?.message || "Erro desconhecido"}`
    //                 );
    //             }

    //             const responseData = await reqData.json()
    //             setUsuarios(responseData)
    //         } catch (err) {
    //             console.log('Erro ao listar Usuarios', err)
    //         }
    //     }

    //     listagemUsuarios()
    // }, [])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let certo = true

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (campoEmail.dado === '') {
            setAvisoEmail("Insira um email!")
            certo = false
        } else if (!emailRegex.test(campoEmail.dado)) {
            setAvisoEmail("Insira um email válido!")
        }
        if (certo) {
            const token = getLocalToken();

            // const procurarUsuario = usuarios.find( user => user.email === campoEmail.dado )
            // console.log(procurarUsuario)

            try {
                const userResponse = await fetch('http://localhost:8080/usuario/enviarEmailUsuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        email: campoEmail.dado
                    })
                });
                if (userResponse.ok) {
                    setAviso("Email enviado com sucesso!");
                    setTimeout(() => {
                        setAviso('');
                    }, 5000);
                    campoEmail.limpar()

                    const userResponseData = await userResponse.json();

                    localStorage.setItem("usuario", JSON.stringify(userResponseData))
                    
                    console.log(userResponseData);
                    console.log(localStorage.getItem("usuario"))
                    
                } else {
                    console.error('Falha ao enviar email');
                    setTimeout(() => {
                        setAviso('');
                    }, 5000);
                }
            } catch (error) {
                console.error(error);
            }
        };
    }

    return (
        <div className="EsqueciSenha">
            <h1 className="titulo">Redefinir senha</h1>
            <form onSubmit={handleSubmit} className="form-redefinir">
                <Link className="retornarLogin" to={'/'}>◀ Voltar</Link>
                {campoEmail.codigo}
                <p className="explicacao">Você irá receber um email neste endereço contendo um procedimento para cadastrar uma nova senha</p>
                <input type="submit" value="Enviar" />
                {aviso !== '' && <p>{aviso}</p>}
            </form>
        </div>
    );
}