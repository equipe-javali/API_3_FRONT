import React, { useEffect, useState } from 'react';
import './css/atualizarAtivo.css'; // Certifique-se de ajustar o nome do seu arquivo CSS
import { useParams } from 'react-router-dom';
import RespostaSistema from '../components/respostaSistema';
import CampoAtivoEditavel from '../components/CampoAtivoEditavel';
import lapis from "../assets/icons/lapis.svg"
import { Link } from 'react-router-dom';
import Modal from '../components/modal/modal';
import getLocalToken from '../utils/getLocalToken';
import CampoAtivoPadrao from '../components/CampoAtivoPadrao';
import CampoAtivoReadOnly from '../components/CampoAtivoReadOnly';
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
    idResponsavel: number;
    departamento: string;
    local: string;
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
    const [tipoAtivoTangivel, setTipoAtivoTangivel] = useState(true)
    const [dados, setDados] = useState<Ativo | null>(null);
    const [textoResposta, setTextoResposta] = useState('');
    const [tipoResposta, setTipoResposta] = useState('');
    const { id } = useParams();
    function fechaPopUp() {
        setTextoResposta('')
        setTipoResposta('')
    }
    const token = getLocalToken();
    useEffect(() => {
        DadosAtivo();
        DadosUsuario();
        ListagemManutencao();
    }, [])
    async function DadosAtivo() {
        try {
            let response = await fetch(`http://localhost:8080/ativoIntangivel/listagem/${id}`, {
                headers: {
                    "Authorization": token
                }
            })
            if (response.status === 200) {
                setTextoTipoOperacional("amortização")
                setTextoDataLimite("Data de expiracao")
                setTipoAtivoTangivel(false)
                return response.json().then(data => {
                    console.log(data)
                    const responsavel = data.ativo.idResponsavel
                    setDados({
                        nome: data.ativo?.nome || "",
                        dataAquisicao: data.ativo?.dataAquisicao || "",
                        custoAquisicao: data.ativo?.custoAquisicao || 0,
                        taxaOperacional: data.taxaAmortizacao || 0,
                        periodoOperacional: data.periodoAmortizacao || "",
                        dataLimite: data.dataExpiracao || "",
                        marca: data.ativo?.marca || "",
                        numeroIdentificacao: data.ativo?.numeroIdentificacao || "",
                        descricao: data.ativo?.descricao || "",
                        tipo: data.ativo?.tipo || "",
                        grauImportancia: data.ativo?.grauImportancia || 0,
                        tag: data.ativo?.tag || "",
                        status: data.ativo?.status || "",
                        idResponsavel: responsavel?.id || 0,
                        departamento: responsavel?.departamento || 0,
                        local: data.ativo?.local || "",
                    });
                })
            } else if (response.status !== 404) {
                setTextoResposta(`Erro ao procurar ativo! Erro:${response.status}`);
                setTipoResposta('Erro');
                return
            } else {
                response = await fetch(`http://localhost:8080/ativoTangivel/listagem/${id}`, {
                    headers: {
                        "Authorization": token
                    }
                })
                if (response.status === 404) {
                    setTextoResposta(`Ativo não existe!`);
                    setTipoResposta('Erro');
                } else if (response.status !== 200) {
                    setTextoResposta(`Erro ao procurar ativo! Erro:${response.status}`);
                    setTipoResposta('Erro');
                    return
                }
                return response.json().then(data => {
                    console.log(data)
                    const responsavel = data.ativo.idResponsavel
                    setDados({
                        nome: data.ativo?.nome || "",
                        dataAquisicao: data.ativo?.dataAquisicao || "",
                        custoAquisicao: data.ativo?.custoAquisicao || 0,
                        taxaOperacional: data.taxaDepreciacao || 0,
                        periodoOperacional: data.periodoDepreciacao || "",
                        dataLimite: data.garantia || "",
                        marca: data.ativo?.marca || "",
                        numeroIdentificacao: data.ativo?.numeroIdentificacao || "",
                        descricao: data.ativo?.descricao || "",
                        tipo: data.ativo?.tipo || "",
                        grauImportancia: data.ativo?.grauImportancia || 0,
                        tag: data.ativo?.tag || "",
                        status: data.ativo?.status || "",
                        idResponsavel: responsavel?.id || 0,
                        departamento: responsavel?.departamento || "",
                        local: data.ativo?.local || "",
                    });
                })
            }
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
            setTipoResposta("Erro")
        }
    }
    async function DadosUsuario() {
        try {
            const response = await fetch('http://localhost:8080/usuario/listagemTodos', {
                headers: {
                    "Authorization": token
                }
            })
            if (!response.ok) {
                setTextoResposta(`Não foi possível listar os usuários! Erro:${response.status}`)
                setTipoResposta("Erro")
                return
            }
            return response.json()
                .then(data => setUsuarios(data))
                .catch(error => {
                    setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                    setTipoResposta("Erro");
                });
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
            setTipoResposta("Erro");
        }
    }
    async function ListagemManutencao() {
        try {
            const resp = await fetch(`http://localhost:8080/manutencao/listagem/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            }).then(resp => {
                if (!resp.ok) {
                    console.error(`Não foi possível listar as manutenções do ativo! Erro: ${resp.status}`);
                }
                return resp.json();
            })
                .then(data => {
                    setManutencoes(
                        (data as Manutencao[]).sort((a, b) => Date.parse(a.dataInicio) - Date.parse(b.dataInicio))
                    )
                })
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
            setTipoResposta("Erro");
        };
    }

    useEffect(() => {
        if (dados) {
            setCamposForm({
                dataAquisicao: dados.dataAquisicao,
                custoAquisicao: dados.custoAquisicao,
                taxaOperacional: dados.taxaOperacional,
                periodoOperacional: dados.periodoOperacional,
                dataLimite: dados.dataLimite,
                marca: dados.marca,
                numeroIdentificacao: dados.numeroIdentificacao,
                tipo: dados.tipo,
                grauImportancia: dados.grauImportancia,
                tag: dados.tag,
                status: dados.status,
            })
            setNomeAtivo(dados.nome)
            setDescricao(dados.descricao)
            setIdResponsavel(dados.idResponsavel)
            setDepartamento(dados.departamento)
            setImportancia(dados.grauImportancia)
            mudaLocal()
        }
    }, [dados]);
    function mudaLocal() {
        if (emManutencao()) {
            setLocal(String(manutencoes[0].localizacao))
        } else if (departamento) {
            return (
                setLocal(departamento)
            );
        }
    }

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
    const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
 
    const [camposForm, setCamposForm] = useState({
        dataAquisicao: "",
        custoAquisicao: 0,
        taxaOperacional: 0,
        periodoOperacional: '',
        dataLimite: "",
        marca: '',
        numeroIdentificacao: '',
        //anexos: [];
        tipo: '',
        grauImportancia: 0,
        tag: '',
        status: '',
    })

    const [idResponsavel, setIdResponsavel] = useState(0)
    const [departamento, setDepartamento] = useState('')
    const [local, setLocal] = useState('')

    function emManutencao(): boolean {
        if (manutencoes.length <= 0) {
            return false;
        }
        return Date.parse(manutencoes[0].dataInicio) < Date.now() && Date.now() < Date.parse(manutencoes[0].dataFim);
    }

    function localAtivo() {
        if (emManutencao()) {
            return manutencoes[0].localizacao;
        } else {
            setLocal(departamento)
            return departamento;
        }
    }

    const [statusA, setStatusA] = useState('');
    useEffect(() => {
        if (emManutencao()) {
            setStatusA('Em manutenção');
        }
        else if (idResponsavel != 0) {
            setStatusA('Em uso');
        } else {
            setStatusA('Não alocado');
        }
    }, [idResponsavel, manutencoes]);

    let [textoTipoOperacional, setTextoTipoOperacional] = useState('depreciação')
    const [nomeAtivo, setNomeAtivo] = useState('')
    const CampoDataAquisicao = CampoAtivoEditavel("Data Aquisição", camposForm.dataAquisicao, "date")
    const CampoCustoAquisicao = CampoAtivoEditavel("Custo Aquisição", camposForm.custoAquisicao, "number")
    const CampoTaxaOperacional = CampoAtivoEditavel(`Taxa  de ${textoTipoOperacional}`, camposForm.taxaOperacional, "number")
    const CampoPeriodoOperacional = CampoAtivoEditavel(`Periodo de ${textoTipoOperacional}`, camposForm.periodoOperacional, "string")
    let [textoDataLimite, setTextoDataLimite] = useState('Validade da garantia')
    const CampoDataLimite = CampoAtivoEditavel(textoDataLimite, camposForm.dataLimite, "date")
    const CampoMarca = CampoAtivoEditavel("Marca", camposForm.marca, "string")
    const [descricao, setDescricao] = useState('')
    const [editarDescricao, setEditarDescricao] = useState(true)
    const CampoTipo = CampoAtivoEditavel("Categoria", camposForm.tipo, "string")
    const [importancia, setImportancia] = useState(0)
    // const CampoImportancia = CampoAtivoEditavel("Importancia", camposForm.grauImportancia, "string")
    const CampoTag = CampoAtivoEditavel("Tag", camposForm.tag, "string")
    const CampoStatus = CampoAtivoReadOnly("Status", statusA, "string")
    const CampoLocal = CampoAtivoReadOnly("Local", local, "string")

    function handleUserChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const userId = Number(event.target.value);
        const user = usuarios.find(u => u?.id === userId);
        setIdResponsavel(userId)
        if (user) {
            setDepartamento(user.departamento)
        }
        setSelectedUser(user || null);
        localAtivo()
    }
    function handleDepartamento(event: React.ChangeEvent<HTMLSelectElement>) {
        setDepartamento(event.target.value)
    }

    function handleImportancia(event: React.ChangeEvent<HTMLSelectElement>) {
        setImportancia(Number(event.target.value));
        textoImportancia()
    }

    function textoImportancia() {
        if (importancia === 1) {
            return 'Baixo';
        } else if (importancia === 2) {
            return 'Médio';
        } else if (importancia === 3) {
            return 'Alto';
        } else {
            return 'Selecione grau de importância';
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            if (tipoAtivoTangivel) {
                const resp = await fetch(`http://localhost:8080/ativoTangivel/atualizacao/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        'id': id,
                        'ativo': {
                            'id': id,
                            'nome': nomeAtivo,
                            'custoAquisicao': CampoCustoAquisicao.dados,
                            'tipo': CampoTipo.dados,
                            'tag': CampoTag.dados,
                            'grauImportancia': importancia,
                            'idResponsavel': { 'id': idResponsavel },
                            'descricao': descricao,
                            'numeroIdentificacao': camposForm.numeroIdentificacao,
                            'marca': CampoMarca.dados,
                            'dataAquisicao': CampoDataAquisicao.dados
                        },
                        'garantia': CampoDataLimite.dados,
                        'taxaDepreciacao': CampoTaxaOperacional.dados,
                        'periodoDepreciacao': CampoPeriodoOperacional.dados
                    })
                })
                    .then(response => {
                        if (response.status === 200) {
                            console.log('Ativo atualizado com sucesso!');
                        } else {
                            console.error('Erro ao atualizar o ativo:', response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error(`Erro ao processar requisição! Erro:${error}`);
                    })
            } else {
                fetch(`http://localhost:8080/ativoIntangivel/atualizacao/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": token
                    },
                    body: JSON.stringify({
                        'id': id,
                        'ativo': {
                            'id': id,
                            'nome': nomeAtivo,
                            'custoAquisicao': CampoCustoAquisicao.dados,
                            'tipo': CampoTipo.dados,
                            'tag': CampoTag.dados,
                            'grauImportancia': importancia,
                            'idResponsavel': { 'id': idResponsavel },
                            'descricao': descricao,
                            'numeroIdentificacao': camposForm.numeroIdentificacao,
                            'marca': CampoMarca.dados,
                            'dataAquisicao': CampoDataAquisicao.dados
                        },
                        'dataExpiracao': CampoDataLimite.dados,
                        'taxaAmortizacao': CampoTaxaOperacional.dados,
                        'periodoAmortizacao': CampoPeriodoOperacional.dados
                    })
                })
                    .then(response => {
                        if (response.status === 200) {
                            console.log('Ativo atualizado com sucesso!');
                            setTextoResposta('Ativo atualizado com sucesso!');
                            setTipoResposta('Sucesso');
                        } else {
                            setTextoResposta(`Erro ao atualizar ativo! Erro:${response.status}`);
                            setTipoResposta('Erro');
                            console.error('Erro ao atualizar o ativo:', response.statusText);
                            console.log(`id: ${id}; nome: ${nomeAtivo};
                                        custo: ${CampoCustoAquisicao.dados}; tipo: ${CampoTipo.dados};
                                        tag: ${CampoTag.dados}; importancia: ${importancia};
                                        responsavel: ${idResponsavel}; descricao: ${descricao};
                                        identificador: ${camposForm.numeroIdentificacao};
                                        marca: ${CampoMarca.dados}; aquisicao: ${CampoDataAquisicao.dados};
                                        expiracao: ${CampoDataLimite.dados}; taxaAm: ${CampoTaxaOperacional.dados};
                                        peridoAmo: ${CampoPeriodoOperacional.dados}`)
                        }
                    })
                    .catch(error => {
                        console.error(`Erro ao processar requisição! Erro:${error}`);
                    })
            }
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
            setTipoResposta("Erro")
        }
    };

    return (
        <div className="atualizarAtivo">
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <h1 className='tituloFormsAtualizarAtivo'>{`Ativos > (ID: ${id} / Número Identificador: ${dados?.numeroIdentificacao})`}</h1>
            <form className="formsAtualizarAtivo" onSubmit={handleSubmit}>
                <div>
                    <div className='divisaoFormsEditar1'>
                        <input type="text" name="nome" value={nomeAtivo} onChange={(e) => setNomeAtivo(e.target.value)} />
                    </div>
                    <div className='divisaoFormsEditar2'>
                        <div>
                            <div>
                                {CampoDataAquisicao.codigo}
                                {CampoTaxaOperacional.codigo}
                                {CampoDataLimite.codigo}
                            </div>
                            <div>
                                {CampoCustoAquisicao.codigo}
                                {CampoPeriodoOperacional.codigo}
                                {CampoMarca.codigo}
                            </div>
                        </div>
                        <div className="campoAtivoEditavel">
                            <span>Descrição</span>
                            <div className={`divTextaareaEditavel ${editarDescricao ? 'desativado' : 'ativado'}`}>
                                <textarea className='campoDescricaoEditavel' placeholder='Digite a descrição...' disabled={editarDescricao} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                                <img src={lapis} alt="Editar" className="lapisEditar" onClick={() => setEditarDescricao(!editarDescricao)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='divisaoFormsEditar3'>
                        <div>
                            {CampoTipo.codigo}
                            <div>
                                <label>Importância </label>
                                <div className='inputContainer'>
                                    <select className='input' name='importancia' value={importancia} onChange={handleImportancia}>
                                        <option value={0} disabled>Selecione grau de importância</option>
                                        <option value={3}>Alto</option>
                                        <option value={2}>Média</option>
                                        <option value={1}>Baixo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            {CampoTag.codigo}
                            {CampoStatus.codigo}
                        </div>
                    </div>
                    <div className='divisaoFormsEditar4'>
                        <div>
                            <div>
                                <label>Responsável </label>
                                <div className='inputContainer'>
                                    <select className='input' name='responsavel' value={idResponsavel} onChange={handleUserChange}>
                                        {usuarios.map(usuario => (
                                            <option key={usuario?.id} value={usuario?.id}>{usuario?.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label>Departamento </label>
                                <div className='inputContainer'>
                                    <select className='input' name='departamento' value={departamento || ''} onChange={handleDepartamento}>
                                        <option value={''}>Selecione departamento</option>
                                        <option value={'Departamento 1'}>Departamento 1</option>
                                        <option value={'Departamento 2'}>Departamento 2</option>
                                    </select>
                                </div>
                            </div>
                            {CampoLocal.codigo}
                        </div>
                        <div className='botoesFormsEditar'>
                            <Link className='button' to={`/HistoricoManutencao/${id}`}>Histórico <br />Manutenção</Link>
                            <Link className='button' to={`/Historico/${id}`}> Linha do tempo <br />do ativo</Link>
                            <input type="submit" placeholder='Atualizar' />
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
}
