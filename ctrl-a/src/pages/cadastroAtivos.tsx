import CampoAtivoPadrao from '../components/CampoAtivoPadrao'
import './css/cadastroAtivos.css'
import { useState } from "react"
import { CadastroAtivosTangiveis1, CadastroAtivosTangiveis2 } from './cadastroAtivosTangiveis'
import CadastroAtivosIntangiveis from './cadastroAtivosIntangiveis'

export default function CadastroAtivos() {
    const pagina1AtivosTangiveis = CadastroAtivosTangiveis1()
    const pagina2AtivosTangiveis = CadastroAtivosTangiveis2()
    const paginaAtivosIntangiveis = CadastroAtivosIntangiveis()

    const nome = CampoAtivoPadrao("", "", "", "")
    const custoAquisicao = CampoAtivoPadrao("", "", "", "")
    const marca = CampoAtivoPadrao("", "", "", "")
    const identificador = CampoAtivoPadrao("", "", "", "")
    const dataAquisicao = CampoAtivoPadrao("", "", "", "")
    const descricao = CampoAtivoPadrao("", "", "", "")
    const [tipoAtivo, setTipoAtivo] = useState(0)
    const [proximo, setProximo] = useState(1)
    const [pagina, setPagina] = useState(1)

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (tipoAtivo === 1) {
            fetch(`LINK_CONEXÃO_BACK_ATIVO_TANGÍVEIS`, {
                method: 'POST',
                body: JSON.stringify({
                    "nome": nome.dados,
                    "custoAquisicao": custoAquisicao.dados,
                    "marca": marca.dados,
                    "identificador": identificador.dados,
                    "dataAquisicao": dataAquisicao.dados,
                    "descricao": descricao.dados,
                    "tag": pagina1AtivosTangiveis.dados.tag,
                    "garantia": pagina1AtivosTangiveis.dados.garantia,
                    "importancia": pagina1AtivosTangiveis.dados.importancia,
                    "validade": pagina2AtivosTangiveis.dados.validade,
                    "periodoDepreciacao": pagina2AtivosTangiveis.dados.periodoDepreciacao,
                    "taxaDepreciacao": pagina2AtivosTangiveis.dados.taxaDepreciacao
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
        } else {
            fetch(`LINK_CONEXÃO_BACK_ATIVO_INTANGÍVEIS`, {
                method: 'POST',
                body: JSON.stringify({
                    "nome": nome.dados,
                    "custoAquisicao": custoAquisicao.dados,
                    "marca": marca.dados,
                    "identificador": identificador.dados,
                    "dataAquisicao": dataAquisicao.dados,
                    "descricao": descricao.dados,
                    "expiracao": paginaAtivosIntangiveis.dados.expiracao,
                    "importancia": paginaAtivosIntangiveis.dados.importancia,
                    "tag": paginaAtivosIntangiveis.dados.tag,
                    "periodoAmortizacao": paginaAtivosIntangiveis.dados.periodoAmortizacao,
                    "taxaAmortizacao": paginaAtivosIntangiveis.dados.taxaAmortizacao
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
        }
    }
    return (
        <>
            <div className='divFormsAtivo'>
                <div>
                    <h1> Cadastrar {tipoAtivo === 1 ? <>Ativo Tangível</> : tipoAtivo === 2 ? <> Ativo Intangível</> : <> Ativo</>}</h1>
                </div>
                <form
                    onSubmit={handleSubmit}
                >
                    {tipoAtivo === 1 ? <>
                        {pagina === 1 && <>
                            {pagina1AtivosTangiveis.código}
                            <div className='divBotaoForms'>
                                <button
                                    onClick={() => setTipoAtivo(0)}
                                >
                                    <span>◀</span> Voltar
                                </button>
                                <button
                                    onClick={() => setPagina(2)}
                                >
                                    Proximo <span>▶</span>
                                </button>
                            </div>
                        </>}
                        {pagina === 2 && <>
                            {pagina2AtivosTangiveis.código}
                            <div className='divBotaoForms'>
                                <button
                                    onClick={() => setPagina(1)}

                                >
                                    <span>◀</span> Voltar
                                </button>
                            </div>
                        </>}
                    </> : tipoAtivo === 2 ? <>
                        {paginaAtivosIntangiveis.código}
                        <div className='divBotaoForms'>
                            <button
                                onClick={() => setTipoAtivo(0)}
                            >
                                <span>◀</span> Voltar
                            </button>
                        </div>
                    </> : <>
                        {nome.codigo}
                        {custoAquisicao.codigo}
                        {marca.codigo}
                        <div>
                            <input
                                type="radio"
                                checked={proximo === 1}
                                onClick={() => setProximo(1)}
                            />
                            <label> Tangível</label>
                            <input
                                type="radio"
                                checked={proximo === 2}
                                onClick={() => setProximo(2)}
                            />
                            <label> InTangível</label>
                        </div>
                        {identificador.codigo}
                        {dataAquisicao.codigo}
                        {descricao.codigo}
                        <div className='divBotaoForms'>
                            <button
                                onClick={() => setTipoAtivo(proximo)}
                            >
                                Proximo <span>▶</span>
                            </button>
                        </div>
                    </>
                    }

                </form>

            </div>
        </>
    )
}