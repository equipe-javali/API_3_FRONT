import CampoAtivoPadrao from '../components/CampoAtivoPadrao';
import './css/cadastroAtivosTangíveis.css'


export default function CadastroAtivosIntangiveis() {
    const tag = CampoAtivoPadrao("", "", "", "")
    const importancia = CampoAtivoPadrao("", "", "", "")
    // const anexo = CampoAtivoPadrao("", "", "", "")
    const expiracao = CampoAtivoPadrao("", "", "", "")
    const periodoAmortizacao = CampoAtivoPadrao("", "", "", "")
    const taxaAmortizacao = CampoAtivoPadrao("", "", "", "")
    return {
        'dados': {
            "tag": tag,
            "importancia": importancia,
            // "anexo": anexo,
            "expiracao": expiracao,
            "periodoAmortizacao": periodoAmortizacao,
            "taxaAmortizacao": taxaAmortizacao,
        },
        'código': (
            <>
                {tag.codigo}
                {importancia.codigo}
                {/* anexo.codigo */}
                {expiracao.codigo}
                {periodoAmortizacao.codigo}
                {taxaAmortizacao.codigo}
            </>
        )
    }
}