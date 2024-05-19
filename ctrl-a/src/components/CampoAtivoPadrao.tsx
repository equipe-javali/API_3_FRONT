import { useState } from "react";
import "./css/CampoAtivo.css"
export default function CampoAtivoPadrao(
    tituloAtivo: string,
    tipoAtivo: string,
    placeholder: string
) {
    let [descAtivo, setDescAtivo] = useState('')
    return {
        "dados": descAtivo,
        "setDados": setDescAtivo,
        "codigo": (
            <div className='divCampoAtivo'>
                <span>{tituloAtivo}</span>
                <input
                    placeholder={placeholder}
                    type={tipoAtivo}
                    value={descAtivo}
                    onChange={(e) => setDescAtivo(e.target.value)}
                />
            </div>
        )
    }
}