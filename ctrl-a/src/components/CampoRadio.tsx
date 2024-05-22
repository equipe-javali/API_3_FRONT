import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoRadio(
    titulo: string,
    opcoes: string[],
    obrigatorio: boolean,
    aviso?: string
) {
    const [escolha, setEscolha] = useState(obrigatorio ? opcoes[0] : '');
    const [erroCampo, setErroCampo] = useState(false);

    useEffect(() => {
        if (aviso) {
            setErroCampo(true);
        }
    }, [aviso]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setEscolha(valor);
        if (erroCampo) {
            setErroCampo(false);
        }
    };

    const handleBlur = () => {
        if (!escolha) {
            setErroCampo(true);
        }
    };

    function limpar() {
        setEscolha('');
    }

    const codigo = (
        <div className={`divCampoRadio ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <div className="opcoesCampoRadio">
                    {opcoes.map((opcao, index) => (
                        <label key={index}>
                            <input
                                type="radio"
                                value={opcao}
                                checked={escolha === opcao}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <div
                                className="controleInputRadio"
                            />
                            <span>{opcao}</span>
                        </label>
                    ))}
                </div>
            </div>
            {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
        </div>
    )

    return {
        dado: escolha,
        codigo,
        limpar
    };
}
