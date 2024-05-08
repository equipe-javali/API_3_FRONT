import { useEffect, useState } from "react";
import "./css/CampoAtivoEditavel.css"
import lapis from "../assets/icons/lapis.svg"
export default function CampoAtivoReadOnly(
    tituloAtivo: string,
    valueAtivo: string | number | Date,
    tipoAtivo: string
) {
    useEffect(() => {
        setDescAtivo(String(valueAtivo))
    }, [valueAtivo])
    let [descAtivo, setDescAtivo] = useState('')
    return {
        "dados": descAtivo,
        "codigo": (
            <div className='campoAtivoReadOnly'>
                <span>{tituloAtivo}</span>
                    <input
                        type={tipoAtivo}
                        value={descAtivo}
                        onChange={(e) => setDescAtivo(e.target.value)}
                        readOnly
                    />
            </div>
        )
    }
}