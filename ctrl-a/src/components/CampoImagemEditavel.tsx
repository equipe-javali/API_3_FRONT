import React, { useEffect, useRef, useState } from "react";
import "./css/CampoPadrao.css";
export default function CampoImagemEditavel(
    nomeBotao: string,
    placeholder: string,
    tamanhoMB: number,
    tipoFoto: string,
    dadosFoto: string
) {
    const [imagemRecebida, setImagemRecebida] = useState<Blob | null>(null);
    const [imagemNova, setImagemNova] = useState<File | null>(null);
    const [arquivo, setArquivo] = useState<{ nome: string; tipoArquivo: string; documento: number[] }>({
        nome: '',
        tipoArquivo: '',
        documento: []
    });
    const [erroCampo, setErroCampo] = useState(false);
    const [avisoImagem, setAvisoImagem] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (dadosFoto) {
            const textoBinario = window.atob(dadosFoto);
            const tamanho = textoBinario.length;
            const bytes = new Uint8Array(tamanho);
            for (let i = 0; i < tamanho; i++) {
                bytes[i] = textoBinario.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: tipoFoto });
            setImagemRecebida(blob);
        }
    }, [dadosFoto, tipoFoto]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivoRecebido = e.target.files;
        if (!arquivoRecebido || arquivoRecebido.length < 1) {
            return;
        }
        const file = arquivoRecebido[0];
        if (file.size > tamanhoMB * 1000000) {
            setErroCampo(true);
            setAvisoImagem(`O arquivo é maior do que ${tamanhoMB} MB`);
            setImagemNova(null);
        } else if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setErroCampo(true);
            setAvisoImagem(`O tipo do arquivo não é válido!`);
            setImagemNova(null);
        } else {
            const documento = await file.arrayBuffer();
            setImagemNova(file);
            setArquivo({
                nome: file.name,
                tipoArquivo: file.type,
                documento: Array.from(new Uint8Array(documento))
            });
            setErroCampo(false);
            setAvisoImagem('');
        }
    };

    const handleInputClick = () => {
        fileInputRef.current?.click();
    };

    const limpar = () => {
        setImagemNova(null);
        setErroCampo(false);
        setAvisoImagem('');
    };

    const codigo = (
        <div className='divCampoImagem'>
            <div className="campoArquivo">
                {imagemNova ? (
                    <div>
                        <span className="previewImagemCampo">
                            <div>
                                <button className="botaoRemoverArquivo" onClick={limpar}>X</button>
                            </div>
                            <img src={URL.createObjectURL(imagemNova)} alt="preview" />
                            {`${imagemNova.name} (${(imagemNova.size / 1000000).toFixed(2)} MB)`}
                        </span>
                    </div>
                ) : (
                    <div>
                        <span className="previewImagemCampo">
                            <img src={imagemRecebida ? URL.createObjectURL(imagemRecebida) : placeholder} alt="preview" />
                        </span>
                    </div>
                )}
                <div>
                    <input
                        type='file'
                        accept=".png, .jpeg, .jpg"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <div
                        className="controleInputArquivo"
                        onClick={handleInputClick}
                    >{nomeBotao}</div>
                    <span>Do tipo: png, jpeg, jpg.</span>
                </div>
                {erroCampo && avisoImagem && <span className="erroCampo">{avisoImagem}</span>}
            </div>
        </div>
    );

    return {
        dado: arquivo,
        codigo,
        erroCampo
    };

};