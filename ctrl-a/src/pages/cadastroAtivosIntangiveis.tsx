import React from 'react';
import CampoAtivoPadrao from '../components/CampoAtivoPadrao';


export default function CadastroAtivosIntangiveis() {
    const tag = CampoAtivoPadrao("Tag", "text", "Insira as tags...")
    const importancia = CampoAtivoPadrao("Grau de importância", "text", "Insira o grau de importância...")
    // const anexo = CampoAtivoPadrao("Anexo", "file", "insira o anexo")
    const expiracao = CampoAtivoPadrao("Data de expiração", "date", "dd/mm/aaaa")
    const periodoAmortizacao = CampoAtivoPadrao("Período de amortização", "text", "anos, meses...")
    const taxaAmortizacao = CampoAtivoPadrao("Taxa de amortização", "number", "00%")
    return {
        'dados': {
            "tag": tag.dados,
            "importancia": importancia.dados,
            // "anexo": anexo,
            "expiracao": expiracao.dados,
            "periodoAmortizacao": periodoAmortizacao.dados,
            "taxaAmortizacao": taxaAmortizacao.dados,
        },
        'código': (
            <>
                <div className='colunaFormsAtivo'>
                    {tag.codigo}
                    {importancia.codigo}
                    {/* anexo.codigo */}
                </div>
                <div className='colunaFormsAtivo'>
                    {expiracao.codigo}
                    {periodoAmortizacao.codigo}
                    {taxaAmortizacao.codigo}
                </div>
            </>
        )
    }
}