import { FormEvent, useState } from "react";
import './css/esqueciSenha.css';
import getLocalToken from "../utils/getLocalToken";
import { Link } from "react-router-dom";
import CampoDropdown from "../components/CampoDropdown";
import CampoData from "../components/CampoData";
import CampoPadrao from "../components/CampoPadrao";
import CampoSenha from "../components/CampoSenha";

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
            const data = {
                "email": campoEmail.dado
            };
            const token = getLocalToken();
            try {
                
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