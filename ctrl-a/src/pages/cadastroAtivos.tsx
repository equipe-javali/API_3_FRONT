import CampoAtivoPadrao from '../components/CampoAtivoPadrao'
import './css/cadastroAtivos.css'
import { useEffect, useState } from "react"
import CadastroAtivosTangiveis from './cadastroAtivosTangiveis'
import CadastroAtivosIntangiveis from './cadastroAtivosIntangiveis'
import RespostaSistema from '../components/respostaSistema'
import getLocalToken from '../utils/getLocalToken'

export default function CadastroAtivos() {
    const paginaAtivosTangiveis = CadastroAtivosTangiveis()
    const paginaAtivosIntangiveis = CadastroAtivosIntangiveis()
    const nome = CampoAtivoPadrao("Nome do ativo:", "text", "Insira o nome")
    const custoAquisicao = CampoAtivoPadrao("Custo da aquisição:", "number", "R$00,00")
    const [tipoAtivo, setTipoAtivo] = useState(0)
    const marca = CampoAtivoPadrao("Marca:", "text", "Digite a marca...")
    const identificador = CampoAtivoPadrao("Número identificador:", "text", "###")
    const dataAquisicao = CampoAtivoPadrao("Data da aquisição:", "date", "dd/mm/aaaa")
    const [descricao, setDescricao] = useState('')
    const [proximo, setProximo] = useState(1)
    const [textoResposta, setTextoResposta] = useState('')
    const [tipoResposta, setTipoResposta] = useState('')
    function fechaPopUp() {
        setTextoResposta('')
        setTipoResposta('')
    }
    useEffect(() => {
        if (tipoResposta === "Sucesso") {
            const timer = setTimeout(() => {
                fechaPopUp();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [tipoResposta]);

    const token = getLocalToken();

    const tipo = CampoAtivoPadrao("Tipo:", "text", "Exemplo: automóvel, mobília...")
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            if (tipoAtivo === 1) {
                fetch("http://localhost:8080/ativoTangivel/cadastro", {
                    method: 'POST',
                    body: JSON.stringify({
                        "ativo": {
                            "nome": nome.dados,
                            "custoAquisicao": Number(custoAquisicao.dados),
                            "tipo": tipo.dados,
                            "tag": paginaAtivosTangiveis.dados.tag,
                            "grauImportancia": Number(paginaAtivosTangiveis.dados.importancia),
                            "descricao": descricao,
                            "numeroIdentificacao": identificador.dados,
                            "marca": marca.dados,
                            "dataAquisicao": dataAquisicao.dados
                        },
                        "garantia": paginaAtivosTangiveis.dados.garantia,
                        "taxaDepreciacao": Number(paginaAtivosTangiveis.dados.taxaDepreciacao),
                        "periodoDepreciacao": paginaAtivosTangiveis.dados.periodoDepreciacao
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "Authorization": token
                    },
                    mode: 'cors'
                })
                    .then((response) => {
                        if (response.status === 201) {
                            setTextoResposta("Ativo cadastrado com sucesso!")
                            setTipoResposta("Sucesso")
                        }
                        else {
                            setTextoResposta(`Não foi possível cadastrar! Erro:${response.status}`)
                            setTipoResposta("Erro")
                        }
                    })
                    .catch((error) => {
                        setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
                        setTipoResposta("Erro")
                    })
            } else {
                fetch("http://localhost:8080/ativoIntangivel/cadastro", {
                    method: 'POST',
                    body: JSON.stringify({
                        "ativo": {
                            "nome": nome.dados,
                            "custoAquisicao": Number(custoAquisicao.dados),
                            "tipo": tipo.dados,
                            "tag": paginaAtivosIntangiveis.dados.tag,
                            "grauImportancia": Number(paginaAtivosIntangiveis.dados.importancia),
                            "descricao": descricao,
                            "numeroIdentificacao": identificador.dados,
                            "marca": marca.dados,
                            "dataAquisicao": dataAquisicao.dados
                        },
                        "dataExpiracao": paginaAtivosIntangiveis.dados.expiracao,
                        "taxaAmortizacao": Number(paginaAtivosIntangiveis.dados.taxaAmortizacao),
                        "periodoAmortizacao": paginaAtivosIntangiveis.dados.periodoAmortizacao
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "Authorization": token
                    },
                    mode: 'cors'
                })
                    .then((response) => {
                        if (response.status === 201) {
                            setTextoResposta("Ativo cadastrado com sucesso!")
                            setTipoResposta("Sucesso")
                        }
                        else {
                            setTextoResposta(`Não foi possível cadastrar! Erro:${response.status}`)
                            setTipoResposta("Erro")
                        }
                    })
                    .catch((error) => {
                        setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
                        setTipoResposta("Erro")
                    })
            }
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
            setTipoResposta("Erro")
        }
    }
    return (
        <>
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <div className='divFormsAtivo'>
                <div>
                    <h1> Cadastrar {tipoAtivo === 1 ? <>Ativo Tangível</> : tipoAtivo === 2 ? <> Ativo Intangível</> : <> ativo</>}</h1>
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
                                <span>Tipo do ativo:</span>
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
                                <span>Descrição:</span>
                                <textarea placeholder='Insira a descrição...' value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                            </div>
                        </div>
                        <div className='divBotaoForms'>
                            <div />
                            <button
                                onClick={() => setTipoAtivo(proximo)}
                            >
                                Próximo <span>▶</span>
                            </button>
                        </div>
                    </>}
                </form>
            </div >
        </>
    )
}