import "./css/CampoPadrao.css";

type arquivo = {
    "nome": string,
    "tipoDocumento": string,
    "documento": string
}

type props = {
    titulo: string,
    texto: string,
    dadosArquivo: arquivo
}

export default function DownloadArquivo(props: props) {
    function binDecode(): Uint8Array {
        const binaryString = window.atob(props.dadosArquivo.documento);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            const ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    function downloadLink(): string {
        const blob = new Blob([binDecode()], { type: props.dadosArquivo.tipoDocumento });
        return window.URL.createObjectURL(blob);
    }

    return (
        <div className={`divCampoSenha`}>
            <div>
                <span>{props.titulo}</span>
                <div className="inputCampoSenha">
                    <a href={downloadLink()} download>{props.texto}</a>
                </div>
            </div>
        </div>
    );
}
