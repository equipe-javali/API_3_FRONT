import './css/atualizarAtivo.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RespostaSistema from '../components/respostaSistema';
import getLocalToken from '../utils/getLocalToken';
import CampoEditavel from '../components/CampoEditavel';
import CampoData from '../components/CampoData';
import campoDescricaoEditavel from '../components/CampoDescricaoEditavel';
import CampoSemTitulo from '../components/CampoSemTitulo';
import CampoDropdown from '../components/CampoDropdown';
import { Link } from 'react-router-dom';
import CampoDesativado from '../components/CampoDesativado';

interface Ativo {
    nome: string;
    dataAquisicao: string;
    custoAquisicao: number;
    taxaOperacional: number;
    periodoOperacional: string;
    dataLimite: string;
    marca: string;
    numeroIdentificacao: string;
    //anexos: Documento[];
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

export default function AtualizarAtivo() {
    const { id } = useParams<{ id: string }>();
    const token = getLocalToken();

    const [textoResposta, setTextoResposta] = useState('');
    const [tipoResposta, setTipoResposta] = useState('');
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

    const [dadosAtivo, setDadosAtivo] = useState<Ativo>({
        nome: "",
        dataAquisicao: "",
        custoAquisicao: 0,
        taxaOperacional: 0,
        periodoOperacional: "",
        dataLimite: "",
        marca: "",
        numeroIdentificacao: "",
        //anexos: Documento[];
        descricao: "",
        tipo: "",
        grauImportancia: 0,
        tag: "",
        status: "",
        departamento: ""
    });
    const [tipoAtivo, setTipoAtivo] = useState("Tangível")
    const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);
    const [listaManutencoes, setListaManutencoes] = useState<Manutencao[]>([]);
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
                    console.log(dadosAtivo)
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
                if (responseUsuario.status !== 200) {
                    setTextoResposta(`Erro ao listar os usuários! Erro:${responseUsuario.status}`);
                    setTipoResposta("Erro")
                } else {
                    const usuarios: Usuario[] = await responseUsuario.json();
                    console.log(usuarios);
                    setListaUsuarios(usuarios);
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
                if (responseManutencao.status !== 200) {
                    setTextoResposta(`Erro ao listar as manutenções! Erro:${responseManutencao.status}`);
                    setTipoResposta("Erro")
                } else {
                    const manutencoes: Manutencao[] = await responseManutencao.json()
                    console.log(manutencoes)
                    setListaManutencoes(manutencoes)
                    trocaLocal()
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
    }, [token, id])
    useEffect((
    ) => {
        if (dadosAtivo.idResponsavel) {
            setAntigoResponsavel(dadosAtivo.idResponsavel.nome);
        }
    }, [dadosAtivo.idResponsavel])

    const [avisoNome, setAvisoNome] = useState<string | undefined>(undefined);
    const campoNome = CampoSemTitulo(
        dadosAtivo.nome,
        "Insira o nome do ativo",
        true,
        avisoNome
    )

    const [avisoCustoAquisicao, setAvisoCustoAquisicao] = useState<string | undefined>(undefined);
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

    const [avisoIdentificador, setAvisoIdentificador] = useState<string | undefined>(undefined);
    const campoIdentificador = CampoSemTitulo(
        dadosAtivo.numeroIdentificacao,
        "Insira o número",
        true,
        avisoIdentificador
    )

    const [avisoDataAquisicao, setAvisoDataAquisicao] = useState<string | undefined>(undefined);
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

    const [avisoDataLimite, setAvisoDataLimite] = useState<string | undefined>(undefined);
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

    const nomesUsuarios: string[] = listaUsuarios.map(usuario => usuario.nome)
    const [antigoResponsavel, setAntigoResponsavel] = useState('')
    const campoResponsavel = CampoDropdown(
        "Responsável:",
        nomesUsuarios,
        antigoResponsavel,
        "Escolha um responsável",
        false
    )

    const [local, setLocal] = useState('')
    const trocaLocal = () => {
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
            return;
        }
        setLocal("Não alocado");
    }

    const [status, setStatus] = useState('')
    const campoStatus = CampoDesativado(
        "Status",
        "text",
        "Status",
        status,
        true
    )
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

    const [departamento, setDepartamento] = useState('')
    useEffect(() => {
        const usuarioDesejado = listaUsuarios.find(usuario => usuario.nome === campoResponsavel.dado);
        if (usuarioDesejado) {
            setDepartamento(usuarioDesejado.departamento)
        }
    }, [campoResponsavel.dado])
    useEffect(() => {
        trocaLocal()
    }, [departamento])

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
                let idResponsavel: number = 0
                const custo = parseFloat(campoCustoAquisicao.dado.replace('R$', '').replace(/\./g, '').replace(',', '.'));
                const taxa = parseFloat(campoTaxaOperacional.dado.replace('%', ''));
                const usuarioDesejado = listaUsuarios.find(usuario => usuario.nome === campoResponsavel.dado);
                if (usuarioDesejado) {
                    idResponsavel = usuarioDesejado.id
                }
                const ativo = {
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
                    const atualizarAtivoIntangivel = await fetch(`http://localhost:8080/ativoTangivel/atualizacao/${id}`, {
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

    return (
        <div className="atualizarAtivo">
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <div className='tituloFormsAtualizarAtivo'>
                <span>
                    {`Ativo > (ID: ${id} / Número Identificador: `}
                </span>
                {campoIdentificador.codigo}
                <span>
                    {`)`}
                </span>
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
                            <Link className='button' to={`/Historico/${id}`}> Linha do tempo <br />do ativo</Link>
                            <input type="submit" value='Atualizar' />
                        </div>
                    </div>
                </div>
            </form>
        </div >
    );
}
