import CampoAtivoPadrao from '../components/CampoAtivoPadrao';

export default function CadastroAtivosTangiveis() {
    const tag = CampoAtivoPadrao("Tag", "text", "Insira as tags...")
    const importancia = CampoAtivoPadrao("Grau de importância", "text", "Insira o grau de importância...")
    const garantia = CampoAtivoPadrao("Validade de garantia", "date", "dd/mm/aaaa")
    // const anexo = CampoAtivoPadrao("Anexo", "file", "insira o anexo")
    const periodoDepreciacao = CampoAtivoPadrao("Período de depreciação", "text", "anos, meses...")
    const taxaDepreciacao = CampoAtivoPadrao("Taxa de depreciação", "number", "00%")
    return {
        'dados': {
            "tag": tag.dados,
            "garantia": garantia.dados,
            //"anexo": anexo.dados,
            "importancia": importancia,
            "periodoDepreciacao": periodoDepreciacao.dados,
            "taxaDepreciacao": taxaDepreciacao.dados,
        },
        'código': (
            <>

                <div className='colunaFormsAtivo'>
                    {tag.codigo}
                    {garantia.codigo}
                    {/* anexo.codigo */}
                </div>
                <div className='colunaFormsAtivo'>
                    {importancia.codigo}
                    {periodoDepreciacao.codigo}
                    {taxaDepreciacao.codigo}
                </div>
            </>
        )
    }
}