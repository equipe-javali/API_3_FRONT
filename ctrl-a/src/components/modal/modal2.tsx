import { ReactElement } from "react";
import './modal2.css'

export default function Modal2(
    aberto: boolean,
    titulo: string,
    conteudo: ReactElement,
    funcao: {
        nome: string,
        acao: () => void
    },
    onClose: () => void,
) {
    return (
        <div className="divModal" style={{ display: aberto ? "block" : "none" }} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <h2>{titulo}</h2>
                <div>
                    {conteudo}
                </div>
                <div className="botoesModal">
                    <button
                        onClick={funcao.acao}
                    >
                        {funcao.nome}
                    </button>
                    <button
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}