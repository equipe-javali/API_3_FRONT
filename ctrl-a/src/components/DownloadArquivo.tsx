import { useEffect, useState } from "react";
import "./css/CampoPadrao.css";

export default function DowloadArquivo(
    titulo: string,
    arquivo?: {
        nome: string,
        tipoDocumento: string,
        documento: string
    },
) {
    const [linkDowload, setLinkDowload] = useState<string | undefined>(undefined)
    useEffect(() => {
        if (arquivo) {
            const textoBinario = window.atob(arquivo.documento);
            const tamanho = textoBinario.length;
            const bytes = new Uint8Array(tamanho);
            for (let i = 0; i < tamanho; i++) {
                const ascii = textoBinario.charCodeAt(i);
                bytes[i] = ascii;
            }
            const blob = new Blob([bytes], { type: arquivo.tipoDocumento });
            setLinkDowload(window.URL.createObjectURL(blob))
        }
    }, [arquivo])
    return <>
        {arquivo && linkDowload && <div className='divCampoArquivo'>
            <span>{titulo}</span>
            <div className="campoArquivo">
                <a
                    className="linkDowloadArquivo"
                    href={linkDowload}
                    download={arquivo.nome}
                >Dowload</a>
            </div>
        </div>}
    </>;
}