import React, { useEffect, useState } from 'react';
import './css/atualizarAtivo.css'; // Certifique-se de ajustar o nome do seu arquivo CSS
import { useParams } from 'react-router-dom';
import RespostaSistema from '../components/respostaSistema';
import CampoAtivoEditavel from '../components/CampoAtivoEditavel';
import lapis from "../assets/icons/lapis.svg"
import { Link } from 'react-router-dom';
import Modal from '../components/modal/modal';
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
    grauImportancia: string;
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
    useEffect(() => {
        try {
            fetch(`http://localhost:8080/ativoIntangivel/listagem/${id}`)
                .then(response => {
                    if (response.status === 200) {
                        setTextoTipoOperacional("amortização")
                        setTextoDataLimite("Data de Expiracao")
                        setTipoAtivoTangivel(false)
                        return response.json();
                    } else if (response.status !== 404) {
                        setTextoResposta(`Erro ao procurar ativo! Erro:${response.status}`);
                        setTipoResposta('Erro');
                    } else {
                        fetch(`http://localhost:8080/ativoTangivel/listagem/${id}`)
                            .then(response => {
                                if (response.status === 404) {
                                    setTextoResposta(`Ativo não existe!`);
                                    setTipoResposta('Erro');
                                } else if (response.status !== 200) {
                                    setTextoResposta(`Erro ao procurar ativo! Erro:${response.status}`);
                                    setTipoResposta('Erro');
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log(data);
                                setDados({
                                    nome: data.ativo?.nome || "",
                                    dataAquisicao: data.ativo?.dataAquisicao || "",
                                    custoAquisicao: data.ativo?.custoAquisicao || 0,
                                    taxaOperacional: data.taxaDepreciacao || 0,
                                    periodoOperacional: data.periodoDepreciacao || "",
                                    dataLimite: data.dataExpiracao || "",
                                    marca: data.ativo?.marca || "",
                                    numeroIdentificacao: data.ativo?.numeroIdentificacao || "",
                                    descricao: data.ativo?.descricao || "",
                                    tipo: data.ativo?.tipo || "",
                                    grauImportancia: data.ativo?.grauImportancia || "",
                                    tag: data.ativo?.tag || "",
                                    status: data.ativo?.status || "",
                                    idResponsavel: data.ativo?.idResponsavel.nome || 0,
                                    departamento: data.ativo?.idResponsavel.departamento || "",
                                    local: data.ativo?.local || "",
                                })
                            })
                            .catch(error => {
                                console.error(`Erro ao processar requisição! Erro:${error}`);
                            })
                    }
                })
                .then(data => {
                    console.log(data)
                    setDados({
                        nome: data.ativo?.nome || "",
                        dataAquisicao: data.ativo?.dataAquisicao || "",
                        custoAquisicao: data.ativo?.custoAquisicao || 0,
                        taxaOperacional: data.taxaAmortizacao || 0,
                        periodoOperacional: data.periodoAmortizacao || "",
                        dataLimite: data.garantia || "",
                        marca: data.ativo?.marca || "",
                        numeroIdentificacao: data.ativo?.numeroIdentificacao || "",
                        descricao: data.ativo?.descricao || "",
                        tipo: data.ativo?.tipo || "",
                        grauImportancia: data.ativo?.grauImportancia || "",
                        tag: data.ativo?.tag || "",
                        status: data.ativo?.status || "",
                        idResponsavel: data.ativo?.idResponsavel || 0,
                        departamento: data.ativo?.departamento || "",
                        local: data.ativo?.local || "",
                    })
                })
                .catch(error => {
                    console.error(`Erro ao processar requisição! Erro:${error}`);
                })
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
            setTipoResposta("Erro")
        }
        try {
            fetch('http://localhost:8080/usuario/listagemTodos')
                .then(response => {
                    if (!response.ok) {
                        setTextoResposta(`Não foi possível listar os ativo! Erro:${response.status}`)
                        setTipoResposta("Erro")
                    }
                    return response.json();
                })
                .then(data => setUsuarios(data))
                .catch(error => {
                    setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                    setTipoResposta("Erro");
                });
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
            setTipoResposta("Erro");
        }
    }, [id])

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
                local: dados.local
            })
            setNomeAtivo(dados.nome)
            setDescricao(dados.descricao)
            setIdResponsavel(dados.idResponsavel)
            setDepartamento(dados.departamento)
        }
    }, [dados]);

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
    const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
    const [showManutencaoModal, setShowManutencaoModal] = useState<boolean>(false);
    const [manutencaoData, setManutencaoData] = useState<Manutencao>({
        id: 0,
        idAtivo: {
            nome: "",
            dataAquisicao: "",
            custoAquisicao: 0,
            taxaOperacional: 0,
            periodoOperacional: "",
            dataLimite: "",
            marca: "",
            numeroIdentificacao: "",
            //anexos: Documento[],
            descricao: "",
            tipo: "",
            grauImportancia: "",
            tag: "",
            status: "",
            idResponsavel: 0,
            departamento: "",
            local: "string"
        },
        tipo: '',
        descricao: '',
        localizacao: '',
        custo: 0,
        dataInicio: '',
        dataFim: '',
    });
    const [manutencao, setManutencao] = useState<Manutencao[]>([]);
    function emManutencao(): boolean {
        if (manutencoes.length <= 0) {
            return false;
        }
        return Date.parse(manutencoes[0].dataInicio) < Date.now() && Date.now() < Date.parse(manutencoes[0].dataFim);
    }
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
        grauImportancia: '',
        tag: '',
        status: '',
        local: ''
    })

    let [textoTipoOperacional, setTextoTipoOperacional] = useState('depreciação')
    const [nomeAtivo, setNomeAtivo] = useState('')
    const [idResponsavel,setIdResponsavel] = useState(0)
    const [departamento,setDepartamento] = useState('')
    const CampoDataAquisicao = CampoAtivoEditavel("Data Aquisição", camposForm.dataAquisicao, "date")
    const CampoCustoAquisicao = CampoAtivoEditavel("Custo Aquisição", camposForm.custoAquisicao, "number")
    const CampoTaxaOperacional = CampoAtivoEditavel(`Taxa  de ${textoTipoOperacional}`, camposForm.taxaOperacional, "number")
    const CampoPeriodoOperacional = CampoAtivoEditavel(`Periodo de ${textoTipoOperacional}`, camposForm.periodoOperacional, "string")
    let [textoDataLimite, setTextoDataLimite] = useState('Validade da garantia')
    //Data de Expiracao
    const CampoDataLimite = CampoAtivoEditavel(textoDataLimite, camposForm.dataLimite, "date")
    const CampoMarca = CampoAtivoEditavel("Marca", camposForm.marca, "string")
    const [descricao, setDescricao] = useState('')
    const [editarDescricao, setEditarDescricao] = useState(true)
    const CampoTipo = CampoAtivoEditavel("Tipo", camposForm.tipo, "string")
    const CampoImportancia = CampoAtivoEditavel("Importancia", camposForm.grauImportancia, "string")
    const CampoTag = CampoAtivoEditavel("Tag", camposForm.tag, "string")
    const CampoStatus = CampoAtivoEditavel("Status", camposForm.status, "string")
    const CampoLocal = CampoAtivoEditavel("Local", camposForm.local, "string")
    function handleManutencaoDataChange(event: React.ChangeEvent<HTMLInputElement>) {
        setManutencaoData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value,
            ativoId: prevData.idAtivo,
        }))
    }

    function localAtivo() {
        if (emManutencao()) {
            return manutencoes[0].localizacao;
        } else {
            return departamento;
        }
    }
    const [statusA, setStatusA] = useState('');
    useEffect(() => {
        if (departamento === '0') {
            setStatusA('Não alocado');
        }
        else if (emManutencao()) {
            setStatusA('Em manutenção');
        } else {
            setStatusA('Em uso');
        }
    }, [idResponsavel, manutencoes]);

    const tipoMapping: { [key: string]: number } = {
        "Preventiva": 1,
        "Corretiva": 2,
        "Preditiva": 3
    };

    const reverseTipoMapping: { [key: number]: string } = {
        1: "Preventiva",
        2: "Corretiva",
        3: "Preditiva"
    };

    function toggleModal() {
        setShowManutencaoModal(!showManutencaoModal);
    }

    function handleManutencaoSubmit() {
        const currentDate = new Date().toISOString().split('T')[0];
        const manutencaoDataWithDates = {
            ...manutencaoData,
            tipo: typeof manutencaoData.tipo === 'string' ? tipoMapping[manutencaoData.tipo] || 0 : manutencaoData.tipo,
            dataInicio: manutencaoData.dataInicio ? new Date(manutencaoData.dataInicio).toISOString() : currentDate,
            dataFim: manutencaoData.dataFim ? new Date(manutencaoData.dataFim).toISOString() : null,
            ativo: { id: manutencaoData.idAtivo },
        };

        fetch('http://localhost:8080/manutencao/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(manutencaoDataWithDates),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Manutenção cadastrada com sucesso!', data);
                setShowManutencaoModal(false);
                setManutencao(prevManutencao => [...prevManutencao, data]);
                setManutencaoData({
                    id: 0,
                    idAtivo: {
                        nome: "",
                        dataAquisicao: "",
                        custoAquisicao: 0,
                        taxaOperacional: 0,
                        periodoOperacional: "",
                        dataLimite: "",
                        marca: "",
                        numeroIdentificacao: "",
                        //anexos: Documento[],
                        descricao: "",
                        tipo: "",
                        grauImportancia: "",
                        tag: "",
                        status: "",
                        idResponsavel: 0,
                        departamento: "",
                        local: "string"
                    },
                    tipo: '',
                    descricao: '',
                    localizacao: '',
                    custo: 0,
                    dataInicio: '',
                    dataFim: '',
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function handleUserChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const userId = Number(event.target.value);
        const user = usuarios.find(u => u.id === userId);
        setIdResponsavel(userId)
        if (user){
            setDepartamento(user.departamento)
        }
        setSelectedUser(user || null);
    }
    function handleDepartamento(event: React.ChangeEvent<HTMLSelectElement>) {
        setDepartamento(event.target.value)
    }

    function handleTextareaDataChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setManutencaoData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value,
            ativoId: prevData.idAtivo,
        }));
    };
    function handleSelectDataChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setManutencaoData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value,
            ativoId: prevData.idAtivo,
        }));
    }

    function handleCancel() {
        setShowManutencaoModal(false);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            if (tipoAtivoTangivel) {
                fetch(`http://localhost:8080/ativoTangivel/atualizacao/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'id': id,
                        'ativo': {
                            'id': id,
                            'nome': nomeAtivo,
                            'custoAquisicao': CampoCustoAquisicao.dados,
                            'tipo': CampoTipo.dados,
                            'tag': CampoTag.dados,
                            'grauImportancia': CampoImportancia.dados,
                            'idResponsavel': { 'id': idResponsavel},
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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        'id': id,
                        'ativo': {
                            'id': id,
                            'nome': nomeAtivo,
                            'custoAquisicao': CampoCustoAquisicao.dados,
                            'tipo': CampoTipo.dados,
                            'tag': CampoTag.dados,
                            'grauImportancia': CampoImportancia.dados,
                            'idResponsavel': { 'id': idResponsavel},
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
                        } else {
                            console.error('Erro ao atualizar o ativo:', response.statusText);
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
            <Modal open={showManutencaoModal} onClose={handleManutencaoSubmit} onCancel={handleCancel} title="Pedido de manutenção">
                <div>
                    <div className="containerModal">
                        <div className='modal-man'>
                            <h3>Local</h3>
                            <input name="localizacao" value={manutencaoData.localizacao} onChange={handleManutencaoDataChange} />
                        </div>
                        <div className='modal-man'>
                            <h3>Custo</h3>
                            <input name="custo" value={manutencaoData.custo} onChange={handleManutencaoDataChange} />
                        </div>
                    </div>
                    <div className="containerModal">
                        <div className='modal-man'>
                            <h3>Data de envio</h3>
                            <input type="date" name="dataInicio" value={manutencaoData.dataInicio} onChange={handleManutencaoDataChange} />
                        </div>
                        <div className='modal-man'>
                            <h3>Data de retorno</h3>
                            <input type="date" name="dataFim" value={manutencaoData.dataFim} onChange={handleManutencaoDataChange} />
                        </div>
                    </div>
                    <div className="containerModal">
                        <div className='modal-man'>
                            <h3>Descrição</h3>
                            <textarea className="textarea-description" name="descricao" value={manutencaoData.descricao} onChange={handleTextareaDataChange} maxLength={100} />
                        </div>
                        <div className='modal-man'>
                            <h3>Tipo</h3>
                            <select name="tipo" value={reverseTipoMapping[Number(manutencaoData.tipo)]} onChange={handleSelectDataChange}>
                                <option value="">Selecione</option>
                                <option value="Preventiva">Preventiva</option>
                                <option value="Corretiva">Corretiva</option>
                                <option value="Preditiva">Preditiva</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>
            <h1 className='tituloFormsAtualizarAtivo'>{`Ativos > (${id} / ${dados?.numeroIdentificacao})`}</h1>
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
                        <div className="campoAtivoEditavel campoDescricaoEditavel">
                            <span>Descrição</span>
                            <div className={`divCampoAtivoEditavel ${editarDescricao ? 'desativado' : 'ativado'}`}>
                                <textarea placeholder='Digite a descrição...' disabled={editarDescricao} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                                <img src={lapis} alt="Editar" className="lapisEditar" onClick={() => setEditarDescricao(!editarDescricao)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='divisaoFormsEditar3'>
                        <div>
                            {CampoTipo.codigo}
                            {CampoImportancia.codigo}
                        </div>
                        <div>
                            {CampoTag.codigo}
                            {CampoStatus.codigo}
                        </div>
                    </div>
                    <div className='divisaoFormsEditar4'>
                        <div>
                            <label>Responsável </label>
                            <div className='inputContainer'>
                                <select className='input' name='responsavel' value={idResponsavel} onChange={handleUserChange}>
                                    {usuarios.map(usuario => (
                                        <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
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
                            <button className='button' onClick={toggleModal}>Adicionar pedido <br />de manutenção</button>
                            <input type="submit" placeholder='Atualizar' />
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
}
