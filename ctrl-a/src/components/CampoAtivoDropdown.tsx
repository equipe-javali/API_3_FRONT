import { useState } from "react";
import "./css/CampoAtivo.css"

export default function CampoAtivoDropdown(
    tituloAtivo: string,
    opcoesAtivos: Array<string>,
    placeholder: string,
    palavraChave: string
) {
    let [temAtivo, setTemAtivo] = useState(false)
    let [descAtivo, setDescAtivo] = useState('')
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDescAtivo(event.target.value);
    };

    return {
        "dados": [temAtivo, descAtivo],
        "codigo": (
            <div className='DescriçõesCampoAtivo'>
                <span>{tituloAtivo}:</span>
                {temAtivo?
                    <select value={descAtivo} onChange={handleSelectChange}>
                        <option
                            value={0}
                            style={{ display: 'none' }}
                        >
                            {placeholder}
                        </option>
                        {opcoesAtivos.map((opcao, index) => (
                            <option key={index} value={opcao}>{opcao}</option>
                        ))}
                    </select>
                :
                    <p>Sem {palavraChave}</p>
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
                    <span>Possuí {palavraChave}?</span>
                </div>
            </div>
        )
    }
}