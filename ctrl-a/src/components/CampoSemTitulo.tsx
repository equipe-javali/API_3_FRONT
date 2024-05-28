import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoSemTitulo(
    descricao: string,
    placeholder: string,
    obrigatorio: boolean,
    aviso?: string
) {
    const [descricaoCampo, setDescricaoCampo] = useState("")
    useEffect(() => {
        setDescricaoCampo(descricao);
    }, [descricao]);

    const [erroCampo, setErroCampo] = useState(false);
    useEffect(() => {
        if (aviso) {
            setErroCampo(true);
        }
    }, [aviso]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setDescricaoCampo(valor);
        if (erroCampo) {
            setErroCampo(false);
        }
    };

    const handleBlur = () => {
        if (!descricaoCampo) {
            setErroCampo(true);
        }
    };

    const codigo = (
        <div className={`divCampoInputSemTitulo ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <input
                    placeholder={placeholder}
                    type='text'
                    value={descricaoCampo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {obrigatorio && <span className="inputObrigatorio">*</span>}
            </div>
            {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
        </div>
    );

    return {
        dado: descricaoCampo,
        codigo,
    };
};