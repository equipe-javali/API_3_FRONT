import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoDescricao(
    titulo: string,
    placeholder: string,
    obrigatorio: boolean,
    aviso?: string
) {
    const [descricaoCampo, setDescricaoCampo] = useState('');
    const [erroCampo, setErroCampo] = useState(false);

    useEffect(() => {
        if (aviso) {
            setErroCampo(true);
        }
    }, [aviso]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    function limpar() {
        setDescricaoCampo('')
    }

    const codigo = (
        <div className={`divCampoDescricao ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <textarea
                    placeholder={placeholder}
                    value={descricaoCampo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </div>
            {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
        </div>
    );

    return {
        dado: descricaoCampo,
        codigo,
        limpar
    };
}
