import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

type arquivo = {
    "nome": string,
    "tipoDocumento": string,
    "documento": number[]
}

export default function CampoArquivo(
    titulo: string,
    obrigatorio: boolean,
    aviso?: string,
    aceitos?: string[]
) {
    const [notaFiscal, setNotaFiscal] = useState({
        "nome": "",
        "tipoDocumento": "",
        "documento": []
    } as arquivo);
    const [erroCampo, setErroCampo] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivos = e.target.files;
        if (!arquivos || arquivos?.length < 1) return;

        const nome = arquivos[0].name;
        const tipoDocumento = arquivos[0].type;
        const documento = await arquivos[0].arrayBuffer();
        
        setNotaFiscal({
            "nome": nome,
            "tipoDocumento": tipoDocumento,
            "documento": Array.from(new Uint8Array(documento))
        } as arquivo);
        if (erroCampo) {
            setErroCampo(false);
        }
    };

    const handleBlur = () => {
        if (!notaFiscal.nome && obrigatorio) {
            setErroCampo(true);
        }
    };

    function limpar() {
        setNotaFiscal({
            "nome": "",
            "tipoDocumento": "",
            "documento": []
        } as arquivo);
    }

    const codigo = (
        <div className={`divCampoSenha  ${erroCampo ? 'alertaCampoErrado' : 'semAlertaCampo'}`}>
            <div>
                <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
                <div className="inputCampoSenha">
                    <input
                        type='file'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        accept={aceitos?.join(",")}
                    ></input>
                </div>
            </div>
            {aviso && erroCampo && <span className="erroCampo">{aviso}</span>}
        </div>
    );

    return {
        dado: notaFiscal,
        codigo,
        limpar
    };
}
