import CampoAtivoPadrao from '../components/CampoAtivoPadrao'
import './css/cadastroAtivos.css'
import { useState } from "react"
import CadastroAtivosTangiveis from './cadastroAtivosTangiveis'
import CadastroAtivosIntangiveis from './cadastroAtivosIntangiveis'

export default function CadastroAtivos() {
    const paginaAtivosTangiveis = CadastroAtivosTangiveis()
    const paginaAtivosIntangiveis = CadastroAtivosIntangiveis()

    const nome = CampoAtivoPadrao("Nome do ativo", "text", "Digite o nome...")
    const custoAquisicao = CampoAtivoPadrao("Custo da aquisição", "text", "R$00,00")
    const [tipoAtivo, setTipoAtivo] = useState(0)
    const marca = CampoAtivoPadrao("Marca", "text", "Digite a marca...")
    const identificador = CampoAtivoPadrao("Número identificador:", "text", "###")
    const dataAquisicao = CampoAtivoPadrao("Data da aquisição", "text", "dd/mm/aaaa")
    const descricao = CampoAtivoPadrao("Descricao", "textarea", "Digite a descricao")
    const [proximo, setProximo] = useState(1)
    const tipo = CampoAtivoPadrao("Tipo", "text", "Exemplo: automóvel, mobília...")

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
                    "tipo": tipo.dados,
                    "descricao": descricao.dados,
                    "tag": paginaAtivosTangiveis.dados.tag,
                    "garantia": paginaAtivosTangiveis.dados.garantia,
                    "importancia": paginaAtivosTangiveis.dados.importancia,
                    "periodoDepreciacao": paginaAtivosTangiveis.dados.periodoDepreciacao,
                    "taxaDepreciacao": paginaAtivosTangiveis.dados.taxaDepreciacao
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
                        {paginaAtivosTangiveis.código}
                        <input
                            type='submit'
                            className='BotaoCadastrarAtivo'
                            value='Cadastrar'
                        />
                        <div className='divBotaoForms'>
                            <button
                                onClick={() => setTipoAtivo(0)}
                            >
                                <span>◀</span> Voltar
                            </button>
                        </div>

                    </> : tipoAtivo === 2 ? <>
                        {paginaAtivosIntangiveis.código}
                        <input
                            type='submit'
                            value='Cadastrar'
                            className='BotaoCadastrarAtivo'
                        />
                        <div className='divBotaoForms'>
                            <button
                                onClick={() => setTipoAtivo(0)}
                            >
                                <span>◀</span> Voltar
                            </button>
                        </div>

                    </> : <>
                        <div className='colunaFormsAtivo'>
                            {nome.codigo}
                            {custoAquisicao.codigo}
                            {marca.codigo}
                        </div>
                        <div className='colunaFormsAtivo'>
                            {tipo.codigo}
                            {identificador.codigo}
                            {dataAquisicao.codigo}
                        </div>
                        <div className='colunaFormsAtivo'>
                            <div className='divInputRadioFormsAtivo'>
                                <span>Tipo do ativo</span>
                                <div>
                                    <div className='inputRadioFormsAtivo'>
                                        <input
                                            type="radio"
                                            checked={proximo === 1}
                                        />
                                        <div
                                            className="controleInputRadioFormsAtivo"
                                            onClick={() => setProximo(1)}
                                        />
                                        <span>Tangível</span>
                                    </div>
                                    <div className='inputRadioFormsAtivo'>
                                        <input
                                            type="radio"
                                            checked={proximo === 2}

                                        />
                                        <div
                                            className="controleInputRadioFormsAtivo"
                                            onClick={() => setProximo(2)}
                                        />
                                        <span>Intangível</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='colunaFormsAtivo'>
                            <div className='descricaoFormsAtivo'>
                                <span>Descrição</span>
                                <textarea placeholder='Digite a descrição...' />
                            </div>
                        </div>
                        <div className='divBotaoForms'>
                            <div />
                            <button
                                onClick={() => setTipoAtivo(proximo)}
                            >
                                Proximo <span>▶</span>
                            </button>
                        </div>
                    </>}
                </form>

            </div >
        </>
    )
}