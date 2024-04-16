import { useState } from "react";
import "./css/respostaSistema.css";
import iconePopUpErro from "../assets/icons/popUpErro.svg"
import iconePopUpSucesso from "../assets/icons/popUpSucesso.svg"
export default function RespostaSistema(textoResposta: string, tipoResposta: string) {
    const [visivel, setVisivel] = useState(true);
    function fechaPopUp() {
        setVisivel(false);
    };

    function impedeFechamento(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();
    };
    if (tipoResposta !== "Erro") {
        setTimeout(() => { setVisivel(false) }, 3000)
    }

    return {
        "visivel": visivel,
        "codigo": <div className="respostaSistema" onClick={fechaPopUp}>
            <div onClick={impedeFechamento}>
                <img
                    src={tipoResposta === 'Erro' ? iconePopUpErro : iconePopUpSucesso}
                    alt={tipoResposta === 'Erro' ? "popUpErro" : "popUpSucesso"}
                />
                <span>{textoResposta}</span>
                {tipoResposta === 'Erro' && <button onClick={(e) => setVisivel(false)}>OK</button>}
            </div>
        </div>
    }
}
