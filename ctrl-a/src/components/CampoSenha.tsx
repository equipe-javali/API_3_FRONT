import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./css/CampoPadrao.css";

export default function CampoSenha(
    titulo: string,
    placeholder: string,
    obrigatorio: boolean, /* UTILIZE ISSO PARA COLOCAR O ASTERÍSTICO*/
    aviso?: string
) {
    const [senha, setSenha] = useState('');
    const [mostraSenha, setMostraSenha] = useState(false);
    const [erroCampo, setErroCampo] = useState(false);
    useEffect(() => {
        if (aviso) {
            setErroCampo(true);
        }
    }, [aviso]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setSenha(valor);
        if (erroCampo) {
            setErroCampo(false);
        }
    };

    const handleBlur = () => {
        if (!senha) {
            setErroCampo(true);
        }
    };

    function limpar() {
        setSenha('')
    }

    const codigo = (
        <div className={`divCampoSenha  ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <div className="inputCampoSenha">
                    <input
                        type={mostraSenha ? "text" : "password"}
                        value={senha}
                        placeholder={placeholder}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {mostraSenha ?
                        <FaEyeSlash className="password-icon" onClick={() => setMostraSenha(!mostraSenha)} /> :
                        <FaEye className="password-icon" onClick={() => setMostraSenha(!mostraSenha)} />
                    }
                </div>
            </div>
            {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
        </div>
    );

    return {
        dado: senha,
        codigo,
        limpar
    };
}
