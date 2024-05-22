import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoDropdown(
    titulo: string,
    opcoes: string[],
    placeholder: string,
    obrigatorio: boolean,
    aviso?: string
) {
    const [escolha, setEscolha] = useState('');
    const [erroCampo, setErroCampo] = useState(false);

    useEffect(() => {
        if (aviso) {
            setErroCampo(true);
        }
    }, [aviso]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        setEscolha('')
    }

    const codigo = (
        <div className={`divCampoPadrao ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <select value={escolha} onChange={handleChange} onBlur={handleBlur}>
                    <option value="" style={{ display: 'none' }}>{placeholder}</option>
                    {opcoes.map((opcao, index) => (
                        <option key={index} value={opcao}>{opcao}</option>
                    ))}
                </select>
                {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
            </div>
        </div>
    );

    return {
        dado: escolha,
        codigo,
        limpar
    };
}
