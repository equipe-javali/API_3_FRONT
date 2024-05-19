import { useState } from 'react';
import CampoAtivoPadrao from '../components/CampoAtivoPadrao';

export default function CadastroAtivosTangiveis() {
    const tag = CampoAtivoPadrao("Tag", "text", "Insira as tags...")
    const [importancia, setImportancia] = useState(0);
    // const importancia = CampoAtivoPadrao("Grau de importância", "text", "Insira o grau de importância...")
    const garantia = CampoAtivoPadrao("Validade de garantia", "date", "dd/mm/aaaa")
    // const anexo = CampoAtivoPadrao("Anexo", "file", "insira o anexo")
    const periodoDepreciacao = CampoAtivoPadrao("Período de depreciação", "text", "anos, meses...")
    const taxaDepreciacao = CampoAtivoPadrao("Taxa de depreciação", "number", "00%")

    function handleImportancia(event: React.ChangeEvent<HTMLSelectElement>) {
        setImportancia(Number(event.target.value));
    }

    return {
        'dados': {
            "tag": tag.dados,
            "garantia": garantia.dados,
            //"anexo": anexo.dados,
            "importancia": importancia,
            "periodoDepreciacao": periodoDepreciacao.dados,
            "taxaDepreciacao": taxaDepreciacao.dados,
        },
        'setDados': {
            "setTag": tag.setDados,
            "setImportancia": setImportancia,
            "setGarantia": garantia.setDados,
            "setPeriodoDepreciacao": periodoDepreciacao.setDados,
            "setTaxaDepreciacao": taxaDepreciacao.setDados
        },
        'código': (
            <>

                <div className='colunaFormsAtivo'>
                    {tag.codigo}
                    {garantia.codigo}
                    {/* anexo.codigo */}
                </div>
                <div className='colunaFormsAtivo'>
                    <div className='selectImportanciaAtivo'>
                        <label>Importância </label>
                        <select className='input' name='importancia' value={importancia} onChange={handleImportancia}>
                            <option value={0} disabled>Selecione grau de importância</option>
                            <option value={3}>Alto</option>
                            <option value={2}>Média</option>
                            <option value={1}>Baixo</option>
                        </select>
                    </div>
                    {periodoDepreciacao.codigo}
                    {taxaDepreciacao.codigo}
                </div>
            </>
        )
    }
}