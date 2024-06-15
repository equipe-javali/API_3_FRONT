import { useState, useEffect } from 'react';
import './css/historicoManutencao.css'
import { useParams } from 'react-router-dom';
import getLocalToken from '../utils/getLocalToken';
import { FaPencilAlt } from 'react-icons/fa';
import moment from 'moment-timezone';
import Modal2 from '../components/modal/modal2';
import CampoPadrao from '../components/CampoPadrao';
import CampoData from '../components/CampoData';
import CampoDescricao from '../components/CampoDescricao';
import CampoDropdown from '../components/CampoDropdown';
import CampoArquivo from '../components/CampoArquivo';
import CampoDesativado from '../components/CampoDesativado';
import DowloadArquivo from '../components/DownloadArquivo';

interface ManutencaoData {
    id: number;
    dataInicio: string;
    dataFim: string;
    custo: number;
    tipo: number;
    descricao: string;
    localizacao: string;
    idNotaFiscal?: {
        nome: string,
        tipoDocumento: string,
        documento: string
    }
}

interface TabelaManutencaoProps {
    manutencoes: ManutencaoData[];
}

export default function HistoricoManutencao() {
    const { id_ativo } = useParams();
    const token = getLocalToken();
    const [update, setUpdate] = useState(false);

    const [manutencoes, setManutencao] = useState<ManutencaoData[]>([]);
    const sortedManutencao = [...manutencoes].sort((a, b) => a.id - b.id);
    const [Pesquisa, setFilterValue] = useState('');
    const tipos = ["Corretiva", "Preventiva", "Preditiva"];

    const [searchTerm, setSearchTerm] = useState('');
    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterValue(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const Pesquisando = sortedManutencao.filter(manutencoes => {
        const searchTermLower = searchTerm.toLowerCase();
        if (Pesquisa === '' || Pesquisa === 'Todos') {
            return Object.values(manutencoes).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchTermLower)
            );
        } else {
            return reverseTipoMapping[Number(manutencoes.tipo)] === Pesquisa &&
                Object.values(manutencoes).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(searchTermLower)
                );
        }
    });

    const [avisoLocalizacao, setAvisoLocalizacao] = useState('')
    const campoLocalizacao = CampoPadrao(
        "Localização",
        "text",
        "insira a localização",
        "local",
        true,
        avisoLocalizacao
    )

    const [localAtualizar, setLocalAtualizar] = useState('')
    const campoLocalizacao2 = CampoDesativado(
        "Localização",
        "text",
        "insira a localização",
        localAtualizar,
        true
    )

    const [avisoCusto, setAvisoCusto] = useState('')
    const campoCusto = CampoPadrao(
        "Custo",
        "text",
        "R$00,00",
        "Custo",
        true,
        avisoCusto
    )

    const [custoAtualizar, setCustoAtualizar] = useState(0)
    const campoCusto2 = CampoDesativado(
        "Custo",
        "text",
        "R$00,00",
        custoAtualizar ? `R$${custoAtualizar.toFixed(2)}` : '',
        true
    )

    const [avisoEnvio, setAvisoEnvio] = useState('')
    const campoEnvio = CampoData(
        "Data de envio",
        "Aquisição",
        "",
        true,
        avisoEnvio
    )

    const [envioAtualizar, setEnvioAtualizar] = useState('')
    const campoEnvio2 = CampoDesativado(
        "Data de envio",
        "text",
        "Aquisição",
        envioAtualizar,
        true
    )

    const campoRetorno = CampoData(
        "Data de retorno",
        "Retorno",
        "",
        false
    )

    const [retornoAtualizar, setRetornoAtualizar] = useState('')
    const campoRetorno2 = CampoData(
        "Data de retorno",
        "Retorno",
        retornoAtualizar,
        false
    )   

    const [avisoDescricao, setAvisoDescricao] = useState('')
    const campoDescricao = CampoDescricao(
        "Descrição",
        "Insira a descrição",
        true,
        avisoDescricao
    )

    const [descricaoAtualizar, setDescricaoAtualizar] = useState('')
    const campoDescricao2 = CampoDesativado(
        "Descrição",
        "text",
        "Insira a descrição",
        descricaoAtualizar,
        true
    )

    const [avisoTipo, setAvisoTipo] = useState('')
    const campoTipo = CampoDropdown(
        "Tipo",
        ["Preventiva", "Corretiva", "Preditiva"],
        "",
        "Selecione",
        true,
        avisoTipo
    )

    const [tipoAtualizar, setTipoAtualizar] = useState('')
    const campoTipo2 = CampoDesativado(
        "Tipo",
        "text",
        "Insira a descrição",
        tipoAtualizar,
        true,
    )

    const [avisoNotaFiscal, setAvisoNotaFiscal] = useState('')
    const campoNotaFiscal = CampoArquivo(
        "Nota Fiscal:",
        [".png", ".pdf"],
        "Enviar nota fiscal",
        5,
        true,
        avisoNotaFiscal
    )

    const [notaFiscalAtualizar, setNotaFiscalAtualizar] = useState({
        nome: '',
        tipoDocumento: '',
        documento: ''
    })
    const campoNotaFiscal2 = DowloadArquivo(
        "Nota Fiscal:",
        notaFiscalAtualizar
    )

    const ConteudoAdicionarManutencao = (<>
        <div className='divModalManutencao'>
            <div>
                <div>
                    {campoLocalizacao.codigo}
                    {campoEnvio.codigo}
                    {campoDescricao.codigo}
                </div>
                <div>
                    {campoTipo.codigo}
                    {campoRetorno.codigo}
                    {campoCusto.codigo}
                </div>
            </div>
            <div>
                {campoNotaFiscal.codigo}
            </div>
        </div>
    </>)

    const ConteudoAtualizarManutencao = (<>
        <div className='divModalManutencao'>
            <div>
                <div>
                    {campoLocalizacao2}
                    {campoEnvio2}
                    {campoDescricao2}
                </div>
                <div>
                    {campoTipo2}
                    {campoRetorno2.codigo}
                    {campoCusto2}
                </div>
            </div>
            <div>
                {campoNotaFiscal2}
            </div>
        </div>
    </>)

    const [mostreAdicionarManutencao, setMostreAdicionarManutencao] = useState(false);
    const tipoMapping: { [key: string]: number } = {
        "Preventiva": 1,
        "Corretiva": 2,
        "Preditiva": 3
    };

    const adicionarManutencao = async () => {
        let certo = true
        if (campoCusto.dado === '') {
            setAvisoCusto("Insira um custo da manutencao!")
            certo = false
        }
        if (campoDescricao.dado === '') {
            setAvisoDescricao("Insira uma descrição!")
            certo = false
        }
        if (campoEnvio.dado === '') {
            setAvisoEnvio("Insira uma data de envio!")
            certo = false
        }
        if (campoLocalizacao.dado === '') {
            setAvisoLocalizacao("Insira uma localização!")
            certo = false
        }
        if (campoNotaFiscal.dado.nome === '' &&
            campoNotaFiscal.dado.tipoArquivo === '' &&
            campoNotaFiscal.dado.documento.length === 0
        ) {
            setAvisoNotaFiscal("Insira a nota fiscal!")
            certo = false
        }
        if (campoTipo.dado === '') {
            setAvisoTipo("Insira um tipo!")
            certo = false
        }
        if (certo) {
            const custo = parseFloat(campoCusto.dado.replace('R$', '').replace(/\./g, '').replace(',', '.'));
            const manutencao = {
                ativo: { id: Number(id_ativo) },
                custo: String(custo),
                dataInicio: campoEnvio.dado,
                dataFim: campoRetorno.dado,
                descricao: campoDescricao.dado,
                idNotaFiscal: {
                    nome: campoNotaFiscal.dado.nome,
                    tipo_documento: campoNotaFiscal.dado.tipoArquivo,
                    documento: campoNotaFiscal.dado.documento
                },
                localizacao: campoLocalizacao.dado,
                tipo: tipoMapping[campoTipo.dado] || 0
            }
            console.log(manutencao)
            try {
                const cadastroManutencao = await fetch('http://localhost:8080/manutencao/cadastro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "Authorization": token
                    },
                    body: JSON.stringify(manutencao),
                    mode: 'cors'
                })
                if (!cadastroManutencao.ok) {
                    throw new Error(`HTTP error! status: ${cadastroManutencao.status}`);
                } else {
                    campoCusto.limpar()
                    campoDescricao.limpar()
                    campoEnvio.limpar()
                    campoLocalizacao.limpar()
                    campoNotaFiscal.limpar()
                    campoRetorno.limpar()
                    campoTipo.limpar()
                    setUpdate(true)
                }
                const manutencaoData = cadastroManutencao.json()
                console.log(manutencaoData);
            } catch (error) {
                console.log('Error', error)
            }
        }
    }

    const [mostreAtualizarManutencao, setMostreAtualizarManutencao] = useState(false);
    const reverseTipoMapping: { [key: number]: string } = {
        1: "Preventiva",
        2: "Corretiva",
        3: "Preditiva"
    };

    const [idManutencaoAtualizar, setIdManutencaoAtualizar] = useState(0)
    const atualizarManutencao = async () => {
        try {
            const atualizandoManutencao = await fetch(`http://localhost:8080/manutencao/atualizacao/${idManutencaoAtualizar}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
                body: JSON.stringify({
                    dataFim: campoRetorno2.dado
                }),
            });
            if (!atualizandoManutencao.ok) {
                throw new Error(`HTTP error! status: ${atualizandoManutencao.status}`);
            } else {
                const manutencaoData = await atualizandoManutencao.json();
                console.log(manutencaoData);
                setMostreAtualizarManutencao(false);
                setUpdate(true);
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    function LinhaManutencao({ id, tipo, descricao, localizacao, custo, dataInicio, dataFim, idNotaFiscal }: ManutencaoData) {
        const [isHovered, setIsHovered] = useState(false);
        function mudarRetorno() {
            if (!dataFim) {
                return (
                    <button type="button" className="btnIcon" onClick={() => {
                        setTipoAtualizar(reverseTipoMapping[tipo] || '')
                        setCustoAtualizar(custo)
                        setDescricaoAtualizar(descricao)
                        setLocalAtualizar(localizacao)
                        setEnvioAtualizar(dataInicio)
                        setRetornoAtualizar(dataFim)
                        idNotaFiscal && setNotaFiscalAtualizar(idNotaFiscal)
                        setIdManutencaoAtualizar(id);
                        setMostreAtualizarManutencao(true)
                    }}>
                        <FaPencilAlt />
                    </button>
                );
            } else if (isHovered) {
                return (
                    <button type="button" className="btnIcon" onClick={() => {
                        setTipoAtualizar(reverseTipoMapping[tipo] || '')
                        setCustoAtualizar(custo)
                        setDescricaoAtualizar(descricao)
                        setLocalAtualizar(localizacao)
                        setEnvioAtualizar(dataInicio)
                        setRetornoAtualizar(dataFim)
                        idNotaFiscal && setNotaFiscalAtualizar(idNotaFiscal)
                        setIdManutencaoAtualizar(id);
                        setMostreAtualizarManutencao(true)
                    }}>
                        <FaPencilAlt />
                    </button>
                );
            } else {
                return (<>
                    {moment(dataFim).format("DD/MM/YYYY")}
                </>);
            }
        }
        return (
            <tr className="linhaMan"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <td className="id">{id}</td>
                <td className="tipo">{reverseTipoMapping[tipo] || ''}</td>
                <td className="descricao">{descricao}</td>
                <td className="local">{localizacao}</td>
                <td className="custo">{custo}</td>
                <td className="notafiscal">{idNotaFiscal ? idNotaFiscal.nome : ''}</td>
                <td className="dataEnvio">{moment(dataInicio).format("DD/MM/YYYY")}</td>
                <td className="dataRetorno">{mudarRetorno()}</td>
            </tr>

        )
    }

    function TabelaManutencao({ manutencoes, filtro }: TabelaManutencaoProps & { filtro: string }) {
        const linhas = manutencoes
            .filter(man => filtro ? reverseTipoMapping[Number(man.tipo)] === filtro : true)
            .map((man: ManutencaoData) => {
                return (
                    <LinhaManutencao
                        key={man.id}
                        id={man.id}
                        tipo={man.tipo}
                        descricao={man.descricao}
                        localizacao={man.localizacao}
                        custo={man.custo}
                        dataInicio={man.dataInicio}
                        dataFim={man.dataFim}
                        idNotaFiscal={man.idNotaFiscal}
                    />
                );
            });
        return (
            <table className="tabelaMan">
                <thead>
                    <tr className="linhaMan" id="cabecalho">
                        <th className="id"><h3>ID</h3></th>
                        <th className="nome"><h3>Tipo</h3></th>
                        <th className="descricao"><h3>Descricão</h3></th>
                        <th className="local"><h3>Local</h3></th>
                        <th className="custo"><h3>Custo</h3></th>
                        <th className="dataEnvio"><h3>Nota Fiscal</h3></th>
                        <th className="dataEnvio"><h3>Data de envio</h3></th>
                        <th className="dataEnvio"><h3>Data de Retorno</h3></th>
                    </tr>
                </thead>
                <tbody>
                    {linhas}
                </tbody>
            </table>
        )
    }

    useEffect(() => {
        const listarManutencoes = async () => {
            try {
                const responseManutencao = await fetch(`http://localhost:8080/manutencao/listagem/${id_ativo}`, {
                    headers: {
                        "Authorization": token
                    }
                });

                if (!responseManutencao.ok) {
                    throw new Error(`HTTP error! status: ${responseManutencao.status}`);
                }
                const manutencoes: ManutencaoData[] = await responseManutencao.json()
                console.log("Passado", manutencoes)
                setManutencao(manutencoes)
                setUpdate(false);
            } catch (error) {
                console.log('Error', error);
            }
        };
        listarManutencoes();
        console.log("Recebido", manutencoes)
    }, [id_ativo, update, token]);


    return (
        <div className="dashboardMan">
            <div className="tituloMan tituloBotao">
                <h1>Manutenção do Ativo ID {id_ativo} </h1>
                <button
                    className='btnManutencao'
                    onClick={() => { setMostreAdicionarManutencao(!mostreAdicionarManutencao) }}
                >
                    Adicionar pedido de manutenção
                </button>
            </div>
            {Modal2(
                mostreAdicionarManutencao,
                "Pedido de Manutenção",
                ConteudoAdicionarManutencao,
                {
                    nome: 'Adicionar manutenção',
                    acao: adicionarManutencao
                },
                () => { setMostreAdicionarManutencao(false) }
            )}
            {Modal2(
                mostreAtualizarManutencao,
                "Mudança da data de retorno",
                ConteudoAtualizarManutencao,
                {
                    nome: 'Atualizar manutenção',
                    acao: atualizarManutencao
                },
                () => { setMostreAtualizarManutencao(false) }
            )}
            <div className="buscaFiltro">
                <select value={Pesquisa} onChange={handleFilterChange} className="mySelect">
                    <option value="">Tipo</option>
                    {tipos.map(tipo => (
                        <option key={tipo} value={tipo}>
                            {tipo}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Buscar por manutenção"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='myInput'
                />
            </div>
            <TabelaManutencao manutencoes={Pesquisando} filtro={Pesquisa} />
        </div >
    );
};