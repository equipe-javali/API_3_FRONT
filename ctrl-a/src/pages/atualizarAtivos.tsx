import React, { useEffect, useState } from 'react';
import './css/atualizarAtivo.css'; // Certifique-se de ajustar o nome do seu arquivo CSS
import { useParams } from 'react-router-dom';
import RespostaSistema from '../components/respostaSistema';
import CampoAtivoEditavel from '../components/CampoAtivoEditavel';
import lapis from "../assets/icons/lapis.svg"
import { Link } from 'react-router-dom';

interface Ativo {
    nome: string;
    dataAquisicao: Date;
    custoAquisicao: number;
    taxaOperacional: number;
    periodoOperacional: string;
    validadeGarantida: Date;
    marca: string;
    numeroIdentificacao: string;
    dataExpiracao: Date;
    //anexos: Documento[];
    descricao: string;
    tipo: string;
    grauImportancia: string;
    tag: string;
    status: string;
    idResponsavel: number;
    departamento: string;
    local: string;
}

interface Props {
    ativo?: Ativo; // tornando a propriedade opcional
}

export default function AtualizarAtivo({ ativo }: Props) {
    const [tipoAtivoTangivel, setTipoAtivoTangivel] = useState(true)
    const [dados, setDados] = useState<Ativo | null>(null);
    const [textoResposta, setTextoResposta] = useState('');
    const [tipoResposta, setTipoResposta] = useState('');
    const { id } = useParams();
    function fechaPopUp() {
        setTextoResposta('')
        setTipoResposta('')
    }
    // Pegando dados anteriores
    useEffect(() => {
        try {
            fetch(`http://localhost:8080/ativoIntangivel/listagem/${id}`)
                .then(response => {
                    if (response.status === 200) {
                        setTextoTipoOperacional("amortização")
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
                                    dataAquisicao: data.ativo?.dataAquisicao || new Date(),
                                    custoAquisicao: data.ativo?.custoAquisicao || 0,
                                    taxaOperacional: data.taxaDepreciacao || 0,
                                    periodoOperacional: data.periodoDepreciacao || "",
                                    validadeGarantida: data.ativo?.validadeGarantida || new Date(),
                                    marca: data.ativo?.marca || "",
                                    numeroIdentificacao: data.ativo?.numeroIdentificacao || "",
                                    dataExpiracao: data.ativo?.dataExpiracao || new Date(),
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
                        dataAquisicao: data.ativo?.dataAquisicao || new Date(),
                        custoAquisicao: data.ativo?.custoAquisicao || 0,
                        taxaOperacional: data.taxaAmortizacao || 0,
                        periodoOperacional: data.periodoAmortizacao || "",
                        validadeGarantida: data.ativo?.validadeGarantida || new Date(),
                        marca: data.ativo?.marca || "",
                        numeroIdentificacao: data.ativo?.numeroIdentificacao || "",
                        dataExpiracao: data.ativo?.dataExpiracao || new Date(),
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
            if (tipoAtivoTangivel) {
            }
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
            setTipoResposta("Erro")
        }
    }, [id])

    useEffect(() => {
        if (dados) {
            setCamposForm({
                dataAquisicao: dados.dataAquisicao,
                custoAquisicao: dados.custoAquisicao,
                taxaOperacional: dados.taxaOperacional,
                periodoOperacional: dados.periodoOperacional,
                validadeGarantida: dados.validadeGarantida,
                marca: dados.marca,
                numeroIdentificacao: dados.numeroIdentificacao,
                dataExpiracao: dados.dataExpiracao,
                tipo: dados.tipo,
                grauImportancia: dados.grauImportancia,
                tag: dados.tag,
                status: dados.status,
                idResponsavel: dados.idResponsavel,
                departamento: dados.departamento,
                local: dados.local
            });
            setNomeAtivo(dados.nome)
            setDescricao(dados.descricao)
        }
    }, [dados]);

    const [camposForm, setCamposForm] = useState({
        dataAquisicao: new Date(),
        custoAquisicao: 0,
        taxaOperacional: 0,
        periodoOperacional: '',
        validadeGarantida: new Date(),
        marca: '',
        numeroIdentificacao: '',
        dataExpiracao: new Date(),
        //anexos: [];
        tipo: '',
        grauImportancia: '',
        tag: '',
        status: '',
        idResponsavel: 0,
        departamento: '',
        local: '',
    })

    let [textoTipoOperacional, setTextoTipoOperacional] = useState('depreciação')
    const [nomeAtivo, setNomeAtivo] = useState('')
    const CampoDataAquisicao = CampoAtivoEditavel("Data Aquisição", camposForm.dataAquisicao, "date")
    const CampoCustoAquisicao = CampoAtivoEditavel("Custo Aquisição", camposForm.custoAquisicao, "number")
    const CampoTaxaOperacional = CampoAtivoEditavel(`Taxa  de ${textoTipoOperacional}`, camposForm.taxaOperacional, "number")
    const CampoPeriodoOperacional = CampoAtivoEditavel(`Periodo de ${textoTipoOperacional}`, camposForm.periodoOperacional, "string")
    const CampoGarantia = CampoAtivoEditavel("Validade da garantia", camposForm.validadeGarantida, "date")
    const CampoMarca = CampoAtivoEditavel("Marca", camposForm.marca, "string")
    const [descricao, setDescricao] = useState('')
    const [editarDescricao, setEditarDescricao] = useState(true)
    const CampoTipo = CampoAtivoEditavel("Tipo", camposForm.tipo, "string")
    const CampoImportancia = CampoAtivoEditavel("Importancia", camposForm.grauImportancia, "string")
    const CampoTag = CampoAtivoEditavel("Tag", camposForm.tag, "string")
    const CampoStatus = CampoAtivoEditavel("Status", camposForm.status, "string")
    const CampoResponsavel = CampoAtivoEditavel("Responsavel", camposForm.idResponsavel, "string")
    const CampoDepartamento = CampoAtivoEditavel("Deparmento", camposForm.departamento, "string")
    const CampoLocal = CampoAtivoEditavel("Local", camposForm.local, "string")

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            if (tipoAtivoTangivel) {
                fetch(`http://localhost:8080/ativoIntangivel/atualizacao/${id}`)
            } else {
                fetch(`http://localhost:8080/ativoIntangivel/atualizacao/${id}`)
            }
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro:${error}`)
            setTipoResposta("Erro")
        } 
    }
    return (
        <div className="atualizarAtivo">
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
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
                                {CampoGarantia.codigo}
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
                            {CampoResponsavel.codigo}
                            {CampoDepartamento.codigo}
                            {CampoLocal.codigo}
                        </div>
                        <div className='botoesFormsEditar'>
                            <Link to={`/HistoricoManutencao/${id}`}>Adicionar<br />manutencao</Link>
                            <input type="submit" placeholder='Atualizar' />
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
}