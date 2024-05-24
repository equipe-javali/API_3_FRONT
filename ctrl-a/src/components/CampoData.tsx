import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoData(
    titulo: string,
    palavraChave: string,
    dataInicial: string,
    obrigatorio: boolean,
    aviso?: string
) {
    const [dataCampo, setDataCampo] = useState('');
    const [erroCampo, setErroCampo] = useState(false);
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const dataAtual = new Date();
        if (palavraChave === "Nascimento") {
            const minDate = new Date();
            minDate.setFullYear(dataAtual.getFullYear() - 150);
            setMinDate(minDate.toISOString().split('T')[0]);
            const maxDate = new Date();
            maxDate.setFullYear(dataAtual.getFullYear() - 18);
            setMaxDate(maxDate.toISOString().split('T')[0]);
        } else if (palavraChave === "Aquisição") {
            setMaxDate(dataAtual.toISOString().split('T')[0])
        }
    }, [palavraChave]);

    useEffect(() => {
        setDataCampo(dataInicial)
    })

    useEffect(() => {
        if (aviso) {
            setErroCampo(true);
        }
    }, [aviso]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setDataCampo(valor);
        if (erroCampo) {
            setErroCampo(false);
        }
    };

    const handleBlur = () => {
        if (!dataCampo) {
            setErroCampo(true);
        }
    };

    function limpar() {
        setDataCampo('')
    }

    const codigo = (
        <div className={`divCampoPadrao ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <input
                    type='date'
                    value={dataCampo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={minDate}
                    max={maxDate}
                />
                {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
            </div>
        </div>
    );

    return {
        dado: dataCampo,
        codigo,
        limpar
    };
}
