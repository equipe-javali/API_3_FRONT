import React, { useEffect, useRef, useState } from "react";
import "./css/CampoPadrao.css";

export default function CampoImagem(
    nome: string,
    placeholder: string,
    tamanhoMB: number,
    obrigatorio: boolean,
    aviso?: string
) {
    const [imagemSelecionada, setImagemSelecionada] = useState<File | null>(null);
    const [arquivo, setArquivo] = useState<{ nome: string, tipoArquivo: string, documento: number[] }>({
        nome: '',
        tipoArquivo: '',
        documento: []
    })
    const [erroCampo, setErroCampo] = useState(false);
    const [avisoImagem, setAvisoImagem] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        aviso && setAvisoImagem(aviso);
    }, [aviso]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivoRecebido = e.target.files;
        if (!arquivoRecebido || arquivoRecebido.length < 1) {
            return;
        }
        if (arquivoRecebido[0].size > tamanhoMB * 1000000) {
            setErroCampo(true);
            setAvisoImagem(`O arquivo é maior do que ${tamanhoMB} MB`);
            setImagemSelecionada(null);
        } else if (!["image/png", "image/jpeg", "image/jpg"].includes(arquivoRecebido[0].type)) {
            setErroCampo(true);
            setAvisoImagem(`O tipo do arquivo não é válido!`);
            setImagemSelecionada(null);
        } else {
            const documento = await arquivoRecebido[0].arrayBuffer();
            setImagemSelecionada(arquivoRecebido[0]);
            setArquivo({
                nome: arquivoRecebido[0].name,
                tipoArquivo: arquivoRecebido[0].type,
                documento: Array.from(new Uint8Array(documento))
            });
            setErroCampo(false);
            setAvisoImagem('');
        }
    };

    const handleInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const limpar = () => {
        setImagemSelecionada(null);
        setErroCampo(false);
        setAvisoImagem('');
    };

    const codigo = (
        <div className='divCampoImagem'>
            <span>{nome} {obrigatorio && <span className="inputObrigatorio">*</span>}</span>
            <div className="campoArquivo">
                {imagemSelecionada ? (
                    <div>
                        <span
                            className="previewImagemCampo"
                        >
                            <img
                                src={URL.createObjectURL(imagemSelecionada)}
                                alt="preview"
                            />
                            {`${imagemSelecionada.name} (${(imagemSelecionada.size / 1000000).toFixed(2)} MB)`}
                        </span>
                        <button
                            className="botaoRemoverArquivo"
                            onClick={limpar}
                        >X</button>
                    </div>
                ) : (
                    <span>Nenhum arquivo inserido</span>
                )}
                <input
                    type='file'
                    accept=".png, .jpeg, .jpg"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <div>
                    <div
                        className="controleInputArquivo"
                        onClick={handleInputClick}
                    >{placeholder}</div>
                    <span>{`Do tipo: png, jpeg, jpg.`}</span>
                </div>
                {erroCampo && avisoImagem && <span className="erroCampo">{avisoImagem}</span>}
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
