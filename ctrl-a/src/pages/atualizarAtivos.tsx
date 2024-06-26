import './css/atualizarAtivo.css';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RespostaSistema from '../components/respostaSistema';
import getLocalToken from '../utils/getLocalToken';
import CampoEditavel from '../components/CampoEditavel';
import CampoData from '../components/CampoData';
import campoDescricaoEditavel from '../components/CampoDescricaoEditavel';
import CampoSemTitulo from '../components/CampoSemTitulo';
import CampoDropdown from '../components/CampoDropdown';
import { Link } from 'react-router-dom';
import CampoDesativado from '../components/CampoDesativado';
import DownloadArquivo from '../components/DownloadArquivo';


interface Ativo {
    nome: string;
    dataAquisicao: string;
    custoAquisicao: number;
    taxaOperacional: number;
    periodoOperacional: string;
    dataLimite: string;
    marca: string;
    numeroIdentificacao: string;
    idNotaFiscal: NotaFiscal;
    descricao: string;
    tipo: string;
    grauImportancia: number;
    tag: string;
    status: string;
    idResponsavel?: Usuario;
    departamento: string;
};

interface Usuario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    nascimento: string;
    departamento: string;
    telefone: string;
    usuariologin: UsuarioLogin[];
};

type UsuarioLogin = {
    id: number;
    senha: string;
}

type Manutencao = {
    id: number;
    idAtivo: Ativo;
    dataInicio: string;
    dataFim: string;
    custo: number;
    tipo: string;
    descricao: string;
    localizacao: string;
};

type NotaFiscal = {
    "nome": string,
    "tipoDocumento": string,
    "documento": string
}

export default function AtualizarAtivo() {
    const [textoResposta, setTextoResposta] = useState('');
    const [tipoResposta, setTipoResposta] = useState('');
    const [dadosAtivo, setDadosAtivo] = useState<Ativo>({
        nome: "",
        dataAquisicao: "",
        custoAquisicao: 0,
        taxaOperacional: 0,
        periodoOperacional: "",
        dataLimite: "",
        marca: "",
        numeroIdentificacao: "",
        idNotaFiscal: {
            nome: "",
            tipoDocumento: "",
            documento: ""
        },
        descricao: "",
        tipo: "",
        grauImportancia: 0,
        tag: "",
        status: "",
        departamento: ""
    });
    const [tipoAtivo, setTipoAtivo] = useState("Tangível");
    const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);
    const [listaManutencoes, setListaManutencoes] = useState<Manutencao[]>([]);
    const [avisoNome, setAvisoNome] = useState<string | undefined>(undefined);
    const [avisoCustoAquisicao, setAvisoCustoAquisicao] = useState<string | undefined>(undefined);
    const [avisoIdentificador, setAvisoIdentificador] = useState<string | undefined>(undefined);
    const [avisoDataAquisicao, setAvisoDataAquisicao] = useState<string | undefined>(undefined);
    const [avisoDataLimite, setAvisoDataLimite] = useState<string | undefined>(undefined);
    const [antigoResponsavel, setAntigoResponsavel] = useState('');
    const [local, setLocal] = useState('');
    const [status, setStatus] = useState('');
    const [departamento, setDepartamento] = useState('');

    const { id } = useParams<{ id: string }>();
    const token = getLocalToken();
    const navegar = useNavigate();
    const nomesUsuarios: string[] = listaUsuarios.map(usuario => usuario.nome)

    const trocaLocal = useCallback(() =>{
        if (listaManutencoes.length !== 0) {
            const dataAtual = new Date();
            const manutencaoAtual = listaManutencoes[0];
            const dataInicio = new Date(manutencaoAtual.dataInicio);
            const dataFim = new Date(manutencaoAtual.dataFim);
            if (dataAtual >= dataInicio && dataAtual <= dataFim) {
                if (manutencaoAtual.localizacao) {
                    setLocal(manutencaoAtual.localizacao);
                } else {
                    setLocal("Em uso");
                }
                return;
            }
        }
        if (departamento) {
            setLocal(departamento);
        } else {
            setLocal("Não alocado");
        }
        return
    },[departamento, listaManutencoes])

    const campoNome = CampoSemTitulo(
        dadosAtivo.nome,
        "Insira o nome do ativo",
        true,
        avisoNome
    )

    const campoCustoAquisicao = CampoEditavel(
        "Custo da Aquisição:",
        "text",
        String(dadosAtivo.custoAquisicao * 100),
        "Insira o custo da aquisição",
        "Custo",
        true,
        avisoCustoAquisicao
    )

    const campoMarca = CampoEditavel(
        "Marca:",
        "text",
        dadosAtivo.marca,
        "Insira a marca",
        "Marca",
        false
    )

    const campoCategoria = CampoEditavel(
        "Categoria:",
        "text",
        dadosAtivo.tipo,
        "Exemplo: automóvel, mobília",
        "Identificador",
        false
    )

    const campoIdentificador = CampoSemTitulo(
        dadosAtivo.numeroIdentificacao,
        "Insira o número",
        true,
        avisoIdentificador
    )

    const campoDataAquisicao = CampoData(
        "Data da aquisição",
        "Aquisição",
        dadosAtivo.dataAquisicao,
        true,
        avisoDataAquisicao
    )

    const campoDescricao = campoDescricaoEditavel(
        "Descrição",
        dadosAtivo.descricao,
        "Insira a descrição",
        false
    )

    const campoTag = CampoEditavel(
        "Tag:",
        "text",
        dadosAtivo.tag,
        "Insira as tags",
        "Tag",
        false
    )

    const campoDataLimite = CampoData(
        `${tipoAtivo === "Tangível" ? "Data de expiração" : "Garantia"}`,
        "Expiração",
        dadosAtivo.dataLimite,
        true,
        avisoDataLimite
    )

    const campoImportancia = CampoDropdown(
        "Importância:",
        ["Alta", "Média", "Baixa"],
        `${dadosAtivo.grauImportancia === 1 ? 'Baixa' :
            dadosAtivo.grauImportancia === 2 ? 'Média' :
                'Alta'}`,
        "Escolha um grau de importância",
        false
    )

    const campoPeriodoOperacional = CampoEditavel(
        `Período de ${tipoAtivo === "Tangível" ? "depreciacao" : "amortização"}:`,
        "text",
        dadosAtivo.periodoOperacional,
        "Exemplo: anos, meses",
        "Amortização",
        false
    )

    const campoTaxaOperacional = CampoEditavel(
        `Taxa de ${tipoAtivo === "Tangível" ? "depreciacao" : "amortização"}:`,
        "text",
        String(dadosAtivo.taxaOperacional),
        "00%",
        "Taxa",
        false
    )
    const campoResponsavel = CampoDropdown(
        "Responsável:",
        nomesUsuarios,
        antigoResponsavel,
        "Escolha um responsável",
        false
    )

    const campoStatus = CampoDesativado(
        "Status",
        "text",
        "Status",
        status,
        true
    )

    const campoDepartemento = CampoDesativado(
        "Departamento:",
        "text",
        "Departamento",
        departamento,
        false
    )

    const CampoLocal = CampoDesativado(
        "Local:",
        "text",
        "Local",
        local,
        true
    )

    useEffect(() => {
        const buscaDadosAtivo = async () => {
            try {
                const responseIntangivel = await fetch(`http://localhost:8080/ativoIntangivel/listagem/${id}`, {
                    headers: {
                        "Authorization": token
                    }
                })
                if (responseIntangivel.status === 200) {
                    const dadosAtivo = await responseIntangivel.json();
                    console.log(dadosAtivo);
                    if (!dadosAtivo.ativo.idNotaFiscal) {
                        fetch(`http://localhost:8080/ativo/exclusao/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                "Authorization": token
                            }
                        })
                            .then(response => {
                                setTextoResposta(`Esse ativo não possuí nota-fiscal e será deletado!`);
                                setTipoResposta('Erro');
                                setTimeout(() => {
                                    fechaPopUp();
                                    navegar("/CadastroAtivo")
                                }, 3000);
                            })
                            .catch(error => {
                                setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                                setTipoResposta('Erro');
                            });
                    }
                    setDadosAtivo({
                        ...dadosAtivo.ativo,
                        periodoOperacional: dadosAtivo.periodoAmortizacao,
                        taxaOperacional: dadosAtivo.taxaAmortizacao,
                        dataLimite: dadosAtivo.dataExpiracao
                    });
                    setTipoAtivo("Intangível");
                } else if (responseIntangivel.status !== 404) {
                    setTextoResposta(`Erro ao procurar ativos intangíveis! Erro:${responseIntangivel.status}`);
                    setTipoResposta('Erro');
                } else {
                    const responseTangivel = await fetch(`http://localhost:8080/ativoTangivel/listagem/${id}`, {
                        headers: {
                            "Authorization": token
                        }
                    })
                    if (responseTangivel.status === 200) {
                        const dadosAtivo = await responseTangivel.json();
                        console.log(dadosAtivo)
                        if (!dadosAtivo.ativo.idNotaFiscal) {
                            fetch(`http://localhost:8080/ativo/exclusao/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "Authorization": token
                                }
                            })
                                .then(response => {
                                    setTextoResposta(`Esse ativo não possuí nota-fiscal e será deletado!`);
                                    setTipoResposta('Erro');
                                    setTimeout(() => {
                                        fechaPopUp();
                                        navegar("/CadastroAtivo")
                                    }, 3000);
                                })
                                .catch(error => {
                                    setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                                    setTipoResposta('Erro');
                                });
                        }
                        setDadosAtivo({
                            ...dadosAtivo.ativo,
                            taxaOperacional: dadosAtivo.taxaDepreciacao,
                            periodoOperacional: dadosAtivo.periodoDepreciacao,
                            dataLimite: dadosAtivo.garantia
                        });
                    } else if (responseTangivel.status === 404) {
                        setTextoResposta(`O ativo não existe!`);
                        setTipoResposta('Erro');
                    } else {
                        setTextoResposta(`Erro ao procurar ativos tangíveis! Erro:${responseIntangivel.status}`);
                        setTipoResposta('Erro');
                    }

                }
            } catch (error) {
                setTextoResposta(`Erro ao processar requisição! Erro:${error}`);
                setTipoResposta("Erro");
            }
        }

        const buscaUsuarios = async () => {
            try {
                const responseUsuario = await fetch('http://localhost:8080/usuario/listagemTodos', {
                    headers: {
                        "Authorization": token
                    }
                })
                if (responseUsuario.status === 200) {
                    const usuarios: Usuario[] = await responseUsuario.json();
                    console.log(usuarios);
                    setListaUsuarios(usuarios);
                } else if (responseUsuario.status !== 204) {
                    setTextoResposta(`Erro ao listar os usuários! Erro:${responseUsuario.status}`);
                    setTipoResposta("Erro")
                }
            } catch (error) {
                setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                setTipoResposta("Erro");
            }
        }

        const buscaManutencao = async () => {
            try {
                const responseManutencao = await fetch(`http://localhost:8080/manutencao/listagem/${id}`, {
                    headers: {
                        "Authorization": token
                    }
                })
                if (responseManutencao.status === 200) {
                    const manutencoes: Manutencao[] = await responseManutencao.json()
                    console.log(manutencoes)
                    setListaManutencoes(manutencoes)
                    trocaLocal()
                } else if (responseManutencao.status !== 204) {
                    setTextoResposta(`Erro ao listar as manutenções! Erro:${responseManutencao.status}`);
                    setTipoResposta("Erro")
                }
            } catch (error) {
                setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                setTipoResposta("Erro");
            }
        }
        buscaDadosAtivo()
        buscaUsuarios()
        buscaManutencao()
        trocaLocal()
    }, [token, id, navegar, trocaLocal])

    useEffect((
    ) => {
        if (dadosAtivo.idResponsavel) {
            setAntigoResponsavel(dadosAtivo.idResponsavel.nome);
        }
    }, [dadosAtivo.idResponsavel])

    useEffect(() => {
        const usuarioDesejado = listaUsuarios.find(usuario => usuario.nome === campoResponsavel.dado);
        if (usuarioDesejado) {
            setDepartamento(usuarioDesejado.departamento)
        }
    }, [campoResponsavel.dado, listaUsuarios])

    useEffect(() => {
        if (listaManutencoes.length !== 0) {
            const dataAtual = new Date();
            const manutencaoAtual = listaManutencoes[0];
            const dataInicio = new Date(manutencaoAtual.dataInicio);
            const dataFim = new Date(manutencaoAtual.dataFim);
            if (dataAtual >= dataInicio && dataAtual <= dataFim) {
                setStatus("Em Manutenção")
                return
            }
        }

        if (campoResponsavel.dado) {
            setStatus("Em uso")
        } else {
            setStatus("Não alocado")


        }
    }, [campoResponsavel.dado, listaManutencoes])

    useEffect(() => {
        if (tipoResposta === "Sucesso") {
            const timer = setTimeout(() => {
                fechaPopUp();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [tipoResposta]);

    useEffect(() => {
        trocaLocal()
    }, [departamento, trocaLocal])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        let certo: boolean = true
        if (campoNome.dado === '') {
            setAvisoNome("Insira um nome!")
            certo = false
        }
        if (campoCustoAquisicao.dado === '') {
            setAvisoCustoAquisicao("Insira um custo de aquisição!")
            certo = false
        }
        if (campoDataAquisicao.dado === '') {
            setAvisoDataAquisicao("Insira uma data de aquisição!")
            certo = false
        }
        if (campoIdentificador.dado === '') {
            setAvisoIdentificador("Insira um número identificador!")
            certo = false
        }
        if (campoNome.dado === '') {
            setAvisoNome("Insira um nome")
        } if (campoDataLimite.dado === '') {
            setAvisoDataLimite(`Insira uma ${tipoAtivo === "Tangível" ? "Data de expiração" : "Garantia"}`)
        }
        if (certo) {
            try {
                const importancia: number =
                    campoImportancia.dado === 'Alta' ? 3 :
                        campoImportancia.dado === 'Média' ? 2 :
                            campoImportancia.dado === 'Baixa' ? 1 :
                                0
                const custo = parseFloat(campoCustoAquisicao.dado.replace('R$', '').replace(/\./g, '').replace(',', '.'));
                const taxa = parseFloat(campoTaxaOperacional.dado.replace('%', ''));
                const usuarioDesejado = listaUsuarios.find(usuario => usuario.nome === campoResponsavel.dado);
                let ativo: Object
                if (usuarioDesejado) {
                    const idResponsavel = usuarioDesejado.id
                    ativo = {
                        id,
                        nome: campoNome.dado,
                        custoAquisicao: custo,
                        tipo: campoCategoria.dado,
                        tag: campoTag.dado,
                        importancia: importancia,
                        idResponsavel: { id: idResponsavel },
                        descricao: campoDescricao.dado,
                        numeroIdentificacao: campoIdentificador.dado,
                        marca: campoMarca.dado,
                        dataAquisicao: campoDataAquisicao.dado
                    }
                } else {
                    ativo = {
                        id,
                        nome: campoNome.dado,
                        custoAquisicao: custo,
                        tipo: campoCategoria.dado,
                        tag: campoTag.dado,
                        importancia: importancia,
                        descricao: campoDescricao.dado,
                        numeroIdentificacao: campoIdentificador.dado,
                        marca: campoMarca.dado,
                        dataAquisicao: campoDataAquisicao.dado
                    }
                }
                if (tipoAtivo === "Tangível") {
                    const atualizarAtivoTangivel = await fetch(`http://localhost:8080/ativoTangivel/atualizacao/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": token
                        },
                        body: JSON.stringify({
                            id,
                            ativo,
                            garantia: campoDataLimite.dado,
                            taxaDepreciacao: taxa,
                            periodoDepreciacao: campoPeriodoOperacional.dado
                        })
                    })
                    if (atualizarAtivoTangivel.status === 200) {
                        setTextoResposta("Ativo Atualizado com sucesso!")
                        setTipoResposta("Sucesso")
                    } else {
                        setTextoResposta(`Erro ao atualizar o ativo! Erro: ${atualizarAtivoTangivel.status}`)
                        setTipoResposta("Erro")
                    }
                } else {
                    const atualizarAtivoIntangivel = await fetch(`http://localhost:8080/ativoIntangivel/atualizacao/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": token
                        },
                        body: JSON.stringify({
                            id,
                            ativo,
                            dataExpiracao: campoDataLimite.dado,
                            taxaAmortizacao: taxa,
                            periodoAmortizacao: campoPeriodoOperacional.dado
                        })
                    })
                    if (atualizarAtivoIntangivel.status === 200) {
                        setTextoResposta("Ativo Atualizado com sucesso!")
                        setTipoResposta("Sucesso")
                    } else {
                        setTextoResposta(`Erro ao atualizar o ativo! Erro: ${atualizarAtivoIntangivel.status}`)
                        setTipoResposta("Erro")
                    }
                }
            } catch (error) {
                setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                setTipoResposta("Erro");
            }
        }
    }

    function fechaPopUp() {
        setTextoResposta('');
        setTipoResposta('');
    }

    return (
        <div className="atualizarAtivo">
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <div className='tituloFormsAtualizarAtivo'>
                <span>
                    {`Ativo > ID: ${id} / Número Identificador: `}
                </span>
                {campoIdentificador.codigo}
            </div>
            <form className="formsAtualizarAtivo" onSubmit={handleSubmit}>
                <div>
                    <div className='divisaoFormsEditar1'>
                        {campoNome.codigo}
                    </div>
                    <div className='divisaoFormsEditar2'>
                        <div>
                            <div>
                                {campoDataAquisicao.codigo}
                                {campoTaxaOperacional.codigo}
                                {campoDataLimite.codigo}
                            </div>
                            <div>
                                {campoCustoAquisicao.codigo}
                                {campoPeriodoOperacional.codigo}
                                {campoMarca.codigo}
                            </div>
                        </div>
                        <div className='divNotaFiscalEditar'>
                            {DownloadArquivo(
                                'Nota Fiscal:',
                                dadosAtivo.idNotaFiscal
                            )}
                        </div>
                        <div>
                            {campoDescricao.codigo}
                        </div>
                    </div>
                </div>
                <div>
                    <div className='divisaoFormsEditar3'>
                        <div>
                            {campoCategoria.codigo}
                            {campoImportancia.codigo}
                        </div>
                        <div>
                            {campoTag.codigo}
                            {campoStatus}
                        </div>
                    </div>
                    <div className='divisaoFormsEditar4'>
                        <div>
                            {campoResponsavel.codigo}
                            {departamento && campoDepartemento}
                            {CampoLocal}
                        </div>
                        <div className='botoesFormsEditar'>
                            <Link className='button' to={`/HistoricoManutencao/${id}`}>Histórico <br />Manutenção</Link>
                            <Link className='button' to={`/Historico/${id}`}> Linha do tempo</Link>
                            <input type="submit" value='Atualizar' />
                        </div>
                    </div>
                </div>
            </form>
        </div >
    );
}
