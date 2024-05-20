import { useState } from 'react';
import CampoAtivoPadrao from '../components/CampoAtivoPadrao';

export default function CadastroAtivosIntangiveis() {
    const tag = CampoAtivoPadrao("Tag", "text", "Insira as tags...", false)
    const [importancia, setImportancia] = useState(0);
    // const importancia = CampoAtivoPadrao("Grau", "text", "Insira o grau de importância...")
    // const anexo = CampoAtivoPadrao("Anexo", "file", "insira o anexo")
    const expiracao = CampoAtivoPadrao("Data de expiração", "date", "dd/mm/aaaa", true)
    const periodoAmortizacao = CampoAtivoPadrao("Período de amortização", "text", "anos, meses...", false)
    const taxaAmortizacao = CampoAtivoPadrao("Taxa de amortização", "number", "00%", false)

    function handleImportancia(event: React.ChangeEvent<HTMLSelectElement>) {
        setImportancia(Number(event.target.value));
    }

    return {
        'dados': {
            "tag": tag.dados,
            "importancia": importancia,
            // "anexo": anexo,
            "expiracao": expiracao.dados,
            "periodoAmortizacao": periodoAmortizacao.dados,
            "taxaAmortizacao": taxaAmortizacao.dados,
        },
        'setDados' : {
            "setTag": tag.setDados,
            "setImportancia": setImportancia,
            "setExpiracao": expiracao.setDados,
            "setPeriodoAmortizacao": periodoAmortizacao.setDados,
            "setTaxaAmortizacao": taxaAmortizacao.setDados
        },
        'código': (
            <>
                <div className='colunaFormsAtivo'>
                    {tag.codigo}
                    {expiracao.codigo}                    
                    {/* anexo.codigo */}
                </div>
                <div className='colunaFormsAtivo'>
                    <div className='selectImportanciaAtivo'>
                        <label>Importância: </label>
                        <select className='input' name='importancia' value={importancia} onChange={handleImportancia}>
                            <option value={0} disabled>Selecione o grau de importância</option>
                            <option value={3}>Alto</option>
                            <option value={2}>Média</option>
                            <option value={1}>Baixo</option>
                        </select>
                    </div>
                    {periodoAmortizacao.codigo}
                    {taxaAmortizacao.codigo}
                </div>
            </>
        )
    }
}