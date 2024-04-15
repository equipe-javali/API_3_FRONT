import { useState } from "react";
import ".css/respostaSistema.css";
export default function respostaSistema(textoResposta: string, tipoResposta: string) {
    const [deletar, setDeletar] = useState(true)
    return {
        "resposta": deletar,
        "codigo": (
            <>
                {tipoResposta === 'erro' ? <div className="respostaSistema Erro">
                    <span>{textoResposta}</span>
                    <button onClick={(e) => setDeletar(false)}>OK</button>
                </div> : <div className="respostaSistema Sucesso">
                    <span>{textoResposta}</span>
                    <button onClick={(e) => setDeletar(false)}>OK</button>
                </div>}
            </>
        )
    }
}