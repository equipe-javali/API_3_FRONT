import lapis from '../assets/icons/lapis.svg';
import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoDescricaoEditavel(
    titulo: string,
    descricao: string,
    placeholder: string,
    obrigatorio: boolean,
    aviso?: string
) {
    const [editavel, setEditavel] = useState(false)
    const [descricaoCampo, setDescricaoCampo] = useState('');
    const [erroCampo, setErroCampo] = useState(false);

    useEffect(() => {
        setDescricaoCampo(descricao)
    }, [descricao])
    useEffect(() => {
        if (aviso) {
            setEditavel(true);
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


    const codigo = (
        <div className={`divCampoDescricaoEditavel ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <div className={`textareaCampoEditavel ${editavel ? 'inputEnabled' : 'inputDesabled'}`}>
                    <textarea
                        placeholder={placeholder}
                        value={descricaoCampo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!editavel}
                    />
                    <img src={lapis} alt='Lápis-Editar' onClick={(e) => setEditavel(!editavel)} />
                </div>
            </div>
            {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
        </div>
    );

    return {
        dado: descricaoCampo,
        codigo
    };
}
