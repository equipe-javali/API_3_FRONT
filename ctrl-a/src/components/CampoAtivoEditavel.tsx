import { useEffect, useState } from "react";
import "./css/CampoAtivoEditavel.css"
import lapis from "../assets/icons/lapis.svg"
export default function CampoAtivoEditavel(
    tituloAtivo: string,
    valueAtivo: string | number | Date,
    tipoAtivo: string
) {
    useEffect(() => {
        setDescAtivo(String(valueAtivo))
    }, [valueAtivo])
    let [descAtivo, setDescAtivo] = useState('')
    let [editavel, setEditavel] = useState(true)
    return {
        "dados": descAtivo,
        "codigo": (
            <div className='campoAtivoEditavel'>
                <span>{tituloAtivo}</span>
                {tipoAtivo !== 'date' ? <div className={`divCampoAtivoEditavel ${editavel ? 'desativado' : 'ativado'}`}>
                    <input
                        type={tipoAtivo}
                        value={descAtivo}
                        onChange={(e) => setDescAtivo(e.target.value)}
                        disabled={editavel}
                    />
                    <img src={lapis} alt="Editar" className="lapisEditar" onClick={() => setEditavel(!editavel)} />
                </div> : <input
                    className="ativado"
                    type={tipoAtivo}
                    value={descAtivo}
                    onChange={(e) => setDescAtivo(e.target.value)}
                />}
            </div>
        )
    }
}