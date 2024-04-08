import { useState } from "react";
import "./css/CampoAtivo.css"
export default function CampoAtivoPadrao(
    tituloAtivo: string,
    tipoAtivo: string,
    placeholder: string,
    palavraChave: string
) {
    let [temAtivo, setTemAtivo] = useState(false)
    let [descAtivo, setDescAtivo] = useState('')

    return {
        "dados": [temAtivo, descAtivo],
        "codigo": (
            <div className='DescriçõesCampoAtivo'>
                <span>{tituloAtivo}:</span>
                {temAtivo ?
                    <input
                        placeholder={placeholder}
                        type={tipoAtivo}
                        value={descAtivo}
                        onChange={(e) => setDescAtivo(e.target.value)}
                    /> :
                    <p
                        className='TextoDescricoesTangivel'
                    >
                        Sem {palavraChave}
                    </p>
                }
                <div>
                    <label className="containerCheckboxFormsAtivos">
                        <input
                            type='checkbox'
                            checked={temAtivo}
                            onClick={() => { setTemAtivo(!temAtivo) }}
                        />
                        <span />
                    </label>
                    <span>Possui {palavraChave}?</span>
                </div>
            </div>
        )
    }
}