import CampoAtivoPadrao from '../components/CampoAtivoPadrao';

function CadastroAtivosTangiveis1() {
    const tag = CampoAtivoPadrao("", "", "", "")
    const garantia = CampoAtivoPadrao("", "", "", "")
    const importancia = CampoAtivoPadrao("", "", "", "")
    //const anexo = CampoAtivoPadrao("", "", "", "")
    return {
        'dados': {
            "tag": tag.dados,
            "garantia": garantia.dados,
            //"anexo": anexo.dados,
            "importancia": importancia
        },
        'código': (
            <>
                {tag.codigo}
                {garantia.codigo}
                {/* anexo.codigo */}
                {importancia.codigo}
            </>
        )
    }
}

function CadastroAtivosTangiveis2() {
    const periodoDepreciacao = CampoAtivoPadrao("", "", "", "")
    const taxaDepreciacao = CampoAtivoPadrao("", "", "", "")
    const validade = CampoAtivoPadrao("", "", "", "")
    return {
        'dados': {
            "periodoDepreciacao": periodoDepreciacao.dados,
            "taxaDepreciacao": taxaDepreciacao.dados,
            "validade": validade.dados,
        },
        'código': (
            <>
                {periodoDepreciacao.codigo}
                {taxaDepreciacao.codigo}
                {validade.codigo}
            </>
        )
    }
}

export { CadastroAtivosTangiveis1, CadastroAtivosTangiveis2 }