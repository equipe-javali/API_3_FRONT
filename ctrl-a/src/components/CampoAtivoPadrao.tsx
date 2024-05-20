import { useState } from "react";
import "./css/CampoAtivo.css"
export default function CampoAtivoPadrao(
    tituloAtivo: string,
    tipoAtivo: string,
    placeholder: string,
    obrigatorio: boolean
) {
    let [descAtivo, setDescAtivo] = useState('')
    return {
        "dados": descAtivo,
        "setDados": setDescAtivo,
        "codigo": (
            <div className='divCampoAtivo'>
                <span>{tituloAtivo} { obrigatorio && <span className="inputObrigatorio">*</span>} </span>
                <input
                    placeholder={placeholder}
                    type={tipoAtivo}
                    value={descAtivo}
                    onChange={(e) => setDescAtivo(e.target.value)}
                    required={obrigatorio}
                    onInvalid={ obrigatorio ? (e) => (e.target as HTMLInputElement).setCustomValidity(`Por favor informe o ${tituloAtivo.toLowerCase()} do ativo`) : undefined }
                    onInput={ obrigatorio ? (e) => e.currentTarget.setCustomValidity('') : undefined }
                />
            </div>
        )
    }
}