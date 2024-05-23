import '../components/css/CampoAtivo.css';
import './css/cadastroAtivos.css'
import { useState } from "react"
import CadastroAtivosTangiveis from './cadastroAtivosTangiveis'
import CadastroAtivosIntangiveis from './cadastroAtivosIntangiveis'
import RespostaSistema from '../components/respostaSistema'
import getLocalToken from '../utils/getLocalToken'
import CampoPadrao from '../components/CampoPadrao'
import CampoData from '../components/CampoData'
import CampoRadio from '../components/CampoRadio';

export default function CadastroAtivos() {
    const paginaAtivosTangiveis = CadastroAtivosTangiveis()
    const paginaAtivosIntangiveis = CadastroAtivosIntangiveis()

    const [avisoNome, setAvisoNome] = useState<string | undefined>(undefined);
    const campoNome = CampoPadrao(
        "Nome: ",
        "text",
        "Insira o nome do ativo",
        "Nome",
        true,
        avisoNome
    )

    const [avisoCustoAquisicao, setAvisoCustoAquisicao] = useState<string | undefined>(undefined);
    const campoCustoAquisicao = CampoPadrao(
        "Custo da Aquisição:",
        "text",
        "Insira o custo da aquisição",
        "Custo",
        true,
        avisoCustoAquisicao
    )

    const campoMarca = CampoPadrao(
        "Marca:",
        "text",
        "Insira a marca",
        "Marca",
        false
    )

    const campoCategoria = CampoPadrao(
        "Categoria:",
        "text",
        "Exemplo: automóvel, mobília",
        "Identificador",
        false
    )

    const [avisoIdentificador, setAvisoIdentificador] = useState<string | undefined>(undefined);
    const campoIdentificador = CampoPadrao(
        "Número identificador",
        "text",
        "Insira o número",
        "Identificador",
        true,
        avisoIdentificador
    )

    const [avisoDataAquisicao, setAvisoDataAquisicao] = useState<string | undefined>(undefined);
    const campoDataAquisicao = CampoData(
        "Data da aquisição",
        "Aquisição",
        true,
        avisoDataAquisicao
    )

    const CampoTipo = CampoRadio(
        "Tipo de ativo:",
        ["Tangível", "Intangível"],
        true
    )

    const [tipoAtivo, setTipoAtivo] = useState(0)
    const [proximo, setProximo] = useState(0)

    const [descricao, setDescricao] = useState('')

    const [textoResposta, setTextoResposta] = useState('')
    const [tipoResposta, setTipoResposta] = useState('')
    function fechaPopUp() {
        setTextoResposta('')
        setTipoResposta('')
    }

    const token = getLocalToken();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        let certo = true
        if (campoNome.dado === '') {
            setAvisoNome("Insira um nome!")
            certo = false
        }
        if (campoCustoAquisicao.dado === '') {
            setAvisoCustoAquisicao("Insira um custo de aquisição!")
            certo = false
        }
        if (campoIdentificador.dado === '') {
            setAvisoIdentificador("Insira um número identificador!")
            certo = false
        }
        if (certo) {
            const custo = parseFloat(campoCustoAquisicao.dado.replace('R$', '').replace(/\./g, '').replace(',', '.'));
            try {
                if (CampoTipo.dado === "Tangível") {
                    if (paginaAtivosTangiveis.dados.garantia === '') {
                        paginaAtivosTangiveis.validacoes.setValidarGarantia("Insira uma garantia!")
                        certo = false
                    } else {
                        const importancia: number =
                            paginaAtivosTangiveis.dados.importancia === 'Alta' ? 3 :
                                paginaAtivosTangiveis.dados.importancia === 'Média' ? 2 :
                                    paginaAtivosTangiveis.dados.importancia === 'Baixa' ? 1 :
                                        0
                        fetch("http://localhost:8080/ativoTangivel/cadastro", {
                            method: 'POST',
                            body: JSON.stringify({
                                "ativo": {
                                    "nome": campoNome.dado,
                                    "custoAquisicao": custo,
                                    "tipo": campoCategoria.dado,
                                    "tag": paginaAtivosTangiveis.dados.tag,
                                    "grauImportancia": importancia,
                                    "descricao": descricao,
                                    "numeroIdentificacao": campoIdentificador.dado,
                                    "marca": campoMarca.dado,
                                    "dataAquisicao": campoDataAquisicao.dado
                                },
                                "garantia": paginaAtivosTangiveis.dados.garantia,
                                "taxaDepreciacao": parseFloat(paginaAtivosTangiveis.dados.taxaDepreciacao.replace('%', '')),
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
                    }
                } else {
                    if (paginaAtivosIntangiveis.dados.expiracao === '') {
                        paginaAtivosIntangiveis.validacoes.setValidarExpiracao("Insira uma data de Expiração!")
                        certo = false
                    } else {
                        const importancia: number =
                            paginaAtivosIntangiveis.dados.importancia === 'Alta' ? 3 :
                                paginaAtivosIntangiveis.dados.importancia === 'Média' ? 2 :
                                    paginaAtivosIntangiveis.dados.importancia === 'Baixa' ? 1 :
                                        0
                        fetch("http://localhost:8080/ativoIntangivel/cadastro", {
                            method: 'POST',
                            body: JSON.stringify({
                                "ativo": {
                                    "nome": campoNome.dado,
                                    "custoAquisicao": custo,
                                    "tipo": campoCategoria.dado,
                                    "tag": paginaAtivosTangiveis.dados.tag,
                                    "grauImportancia": importancia,
                                    "descricao": descricao,
                                    "numeroIdentificacao": campoIdentificador.dado,
                                    "marca": campoMarca.dado,
                                    "dataAquisicao": campoDataAquisicao.dado
                                },
                                "dataExpiracao": paginaAtivosIntangiveis.dados.expiracao,
                                "taxaAmortizacao": parseFloat(paginaAtivosIntangiveis.dados.taxaAmortizacao.replace('%', '')),
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
                }
                if (certo) {
                    campoNome.limpar()
                    campoCustoAquisicao.limpar()
                    campoCustoAquisicao.limpar()
                    campoMarca.limpar()
                    campoIdentificador.limpar()
                    campoDataAquisicao.limpar()
                    campoCategoria.limpar()
                    setDescricao("")
                    paginaAtivosIntangiveis.limpar()
                    paginaAtivosTangiveis.limpar()
                }
            } catch (error) {
                setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
                setTipoResposta("Erro")
            }
        } else {
            setProximo(0)
        }
    }
    return (
        <>
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <div className='divFormsAtivo'>
                <div>
                    <h1> Cadastrar ativo{proximo === 0 ?
                        '.' :
                        CampoTipo.dado === 'Tangível' ? ' tangível.' :
                            ' intangível.'}</h1>
                </div>
                <form
                    onSubmit={handleSubmit}
                >
                    {CampoTipo.dado === "Tangível" && proximo === 1 ? <>
                        {paginaAtivosTangiveis.codigo}
                        <input
                            type='submit'
                            className='BotaoCadastrarAtivo'
                            value='Cadastrar'
                        />

                        <div className='divBotaoForms'>
                            <button
                                onClick={() => setProximo(0)}
                            >
                                <span>◀</span> Voltar
                            </button>
                        </div>

                    </> : CampoTipo.dado === "Intangível" && proximo === 1 ? <>
                        {paginaAtivosIntangiveis.codigo}
                        <input
                            type='submit'
                            value='Cadastrar'
                            className='BotaoCadastrarAtivo'
                        />
                        <div className='divBotaoForms'>
                            <button
                                onClick={() => setProximo(0)}
                            >
                                <span>◀</span> Voltar
                            </button>
                        </div>
                    </> : <>
                        <div className='colunaFormsAtivo'>
                            {campoNome.codigo}
                            {campoCustoAquisicao.codigo}
                            {campoMarca.codigo}
                        </div>
                        <div className='colunaFormsAtivo'>
                            {campoCategoria.codigo}
                            {campoIdentificador.codigo}
                            {campoDataAquisicao.codigo}
                        </div>
                        <div className='colunaFormsAtivo'>
                            {CampoTipo.codigo}
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
                                onClick={() => setProximo(1)}
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