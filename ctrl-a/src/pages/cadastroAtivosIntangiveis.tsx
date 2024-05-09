import { useState } from 'react';
import CampoAtivoPadrao from '../components/CampoAtivoPadrao';

export default function CadastroAtivosIntangiveis() {
    const tag = CampoAtivoPadrao("Tag", "text", "Insira as tags...")
    const [importancia, setImportancia] = useState(0);
    // const importancia = CampoAtivoPadrao("Grau", "text", "Insira o grau de importância...")
    // const anexo = CampoAtivoPadrao("Anexo", "file", "insira o anexo")
    const expiracao = CampoAtivoPadrao("Data de expiração", "date", "dd/mm/aaaa")
    const periodoAmortizacao = CampoAtivoPadrao("Período de amortização", "text", "anos, meses...")
    const taxaAmortizacao = CampoAtivoPadrao("Taxa de amortização", "number", "00%")

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
        'código': (
            <>
                <div className='colunaFormsAtivo'>
                    {tag.codigo}
                    <div className='selectImportanciaAtivo'>
                        <label>Importância </label>
                        <select className='input' name='importancia' value={importancia} onChange={handleImportancia}>
                            <option value={0} disabled>Selecione grau de importância</option>
                            <option value={3}>Alto</option>
                            <option value={2}>Média</option>
                            <option value={1}>Baixo</option>
                        </select>
                    </div>
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