import { useEffect, useRef, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoArquivo(
    titulo: string,
    tipos: string[],
    placeholder: string,
    tamanhoMB: number,
    obrigatorio: boolean,
    aviso?: string,
) {
    const [arquivo, setArquivo] = useState<{ nome: string, tipoArquivo: string, documento: number[] }>({
        nome: '',
        tipoArquivo: '',
        documento: []
    })
    const [tamanho, setTamanho] = useState(0)
    const [erroCampo, setErroCampo] = useState(false);
    useEffect(() => {
        aviso && setAvisoArquivo(aviso)
        aviso && setErroCampo(true)
    }, [aviso])

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivoRecebido = e.target.files;
        if (!arquivoRecebido || arquivoRecebido.length < 1) {
            return;
        };
        const documento = await arquivoRecebido[0].arrayBuffer();
        setTamanho(arquivoRecebido[0].size)
        setArquivo({
            nome: arquivoRecebido[0].name,
            tipoArquivo: arquivoRecebido[0].type,
            documento: Array.from(new Uint8Array(documento))
        });
    }

    function limpar() {
        setArquivo({
            nome: '',
            tipoArquivo: '',
            documento: []
        });
        setTamanho(0)
    }

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const [avisoArquivo, setAvisoArquivo] = useState('')
    useEffect(() => {
        const arq = arquivo.nome.split('.')
        if (tamanho > (tamanhoMB * 1000000)) {
            setErroCampo(true);
            setAvisoArquivo(`O arquivo é maior do que ${tamanhoMB} MB`)
        } else if (arquivo.nome !== '' && !tipos.includes('.' + (arq[arq.length - 1]))) {
            setErroCampo(true);
            setAvisoArquivo(`O tipo do arquivo não é válido! `)
        } else if (erroCampo) {
            setErroCampo(false);
        }
    }, [arquivo])

    const codigo = (
        <div className='divCampoArquivo'>
            <span>{titulo} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
            <div className="campoArquivo">
                {arquivo.tipoArquivo !== '' ?
                    <span>
                        {`${arquivo.nome} (${(tamanho / 1000000).toFixed(2)} MB)`}
                        <button
                            className="botaoRemoverArquivo"
                            onClick={() => limpar()}    
                        >X</button>
                    </span> :
                    <span>Nenhum arquivo inserido</span>
                }
                <input
                    type='file'
                    accept={tipos?.join(",")}
                    onChange={handleChange}
                    ref={fileInputRef}
                />
                <div>
                    <div
                        className="controleInputArquivo"
                        onClick={handleInputClick}
                    >{placeholder}</div>
                    <span>{`Do tipo: ${tipos.join(", ").replace(/\./g, '')}.`}</span>
                </div>
                {erroCampo && avisoArquivo && <span className="erroCampo">{avisoArquivo}</span>}
            </div>
        </div>
    );

    return {
        dado: arquivo,
        codigo,
        limpar,
        erroCampo
    };
}