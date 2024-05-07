
import { useState, useEffect } from 'react';
import './css/historicoManutencao.css'
import Modal from '../components/modal/modal';
import { useParams } from 'react-router-dom';
import getLocalToken from '../utils/getLocalToken';

interface ManutencaoData {
    id: number;
    tipo: string | number;
    descricao: string;
    localizacao: string;
    custo: string;
    dataInicio: string;
    dataFim: string;
    ativoId: number;
}

interface TabelaManutencaoProps {
manutencao: ManutencaoData[];
}
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
function LinhaManutencao({ id, tipo, descricao, localizacao,custo, dataInicio, dataFim }: ManutencaoData) {
    return (
        <tr className="linhaMan">
            <td className="id">{id}</td>
            <td className="tipo">{reverseTipoMapping[Number(tipo)]}</td>
            <td className="descricao">{descricao}</td>
            <td className="local">{localizacao}</td>
            <td className="custo">{custo}</td>
            <td className="dataEnvio">{new Date(dataInicio).toLocaleDateString()}</td>
            <td className="dataRetorno">{dataFim ? new Date(dataFim).toLocaleDateString() : ''}</td>
        </tr>

    )
}

function TabelaManutencao({ manutencao, filtro }: TabelaManutencaoProps & { filtro: string }) {
    const linhas = manutencao
        .filter(man => filtro ? reverseTipoMapping[Number(man.tipo)] === filtro : true)
        .map((man: ManutencaoData) => {
            return (
                <LinhaManutencao
                    key={man.id}
                    id={man.id}
                    ativoId={man.ativoId}
                    tipo={man.tipo}
                    descricao={man.descricao}
                    localizacao={man.localizacao}
                    custo={man.custo}
                    dataInicio={man.dataInicio}
                    dataFim={man.dataFim}
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
                    <th className="dataEnvio"><h3>Data de envio</h3></th>
                    <th className="DataRetorno"><h3>Data de retorno</h3></th>
                </tr>
            </thead>
            <tbody>
                {linhas}
            </tbody>
        </table>
    )
}
export default function HistoricoManutencao() {
    const { id_ativo } = useParams();
    const [manutencaoData, setManutencaoData] = useState<ManutencaoData>({
        id: 0,
        ativoId: Number(id_ativo),
        tipo: '',
        descricao: '',
        localizacao: '',
        custo: '',
        dataInicio: '',
        dataFim: '',
    });

    const [manutencao, setManutencao] = useState<ManutencaoData[]>([]);
    const [update] = useState(false);
    const sortedManutencao = [...manutencao].sort((a, b) => a.id - b.id);
    const [Pesquisa, setFilterValue] = useState('');
    const tipos = ["Corretiva", "Preventiva", "Preditiva"];
    const [searchTerm, setSearchTerm] = useState('');
    const [showManutencaoModal, setShowManutencaoModal] = useState<boolean>(false);
    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterValue(event.target.value);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const Pesquisando = sortedManutencao.filter(manutencao => {
        const searchTermLower = searchTerm.toLowerCase();

        if (Pesquisa === '' || Pesquisa === 'Todos') {
            return Object.values(manutencao).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchTermLower)
            );
        } else {
            return reverseTipoMapping[Number(manutencao.tipo)] === Pesquisa &&
                Object.values(manutencao).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(searchTermLower)
                );
        }
    });
    function toggleModal() {
        setShowManutencaoModal(!showManutencaoModal);
   }
   function handleManutencaoDataChange(event: React.ChangeEvent<HTMLInputElement>) {
    setManutencaoData(prevData => ({
        ...prevData,
        [event.target.name]: event.target.value,
        ativoId: prevData.ativoId,
    }));
}

    function handleTextareaDataChange (event: React.ChangeEvent<HTMLTextAreaElement>) {
        setManutencaoData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value,
            ativoId: prevData.ativoId,
        }));
    };
    function handleSelectDataChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setManutencaoData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value,
            ativoId: prevData.ativoId,
        }));
    }
    function handleCancel() {
        setShowManutencaoModal(false);
    }
    function handleManutencaoSubmit() {
        const currentDate = new Date().toISOString().split('T')[0];
        const manutencaoDataWithDates = {
            ...manutencaoData,
            tipo: typeof manutencaoData.tipo === 'string' ? tipoMapping[manutencaoData.tipo] || 0 : manutencaoData.tipo,
            dataInicio: manutencaoData.dataInicio ? new Date(manutencaoData.dataInicio).toISOString() : currentDate,
            dataFim: manutencaoData.dataFim ? new Date(manutencaoData.dataFim).toISOString() : null,
            ativo: { id: manutencaoData.ativoId },
        };

        fetch('http://localhost:8080/manutencao/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
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
                    ativoId: Number(id_ativo),
                    tipo: '',
                    descricao: '',
                    localizacao: '',
                    custo: '',
                    dataInicio: '',
                    dataFim: '',
                });
            })
            .catch(error => console.error('Error:', error));
    }
    const token = getLocalToken();

    useEffect(() => {
        console.log('Fetching manutencoes...');

        fetch(`http://localhost:8080/manutencao/listagem/${id_ativo}`,{
            headers: {
                "Authorization": token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data);
                setManutencao(data);
            })
            .catch(error => console.error('Error:', error));
    }, [id_ativo, update]);


    return (
        <div className="dashboardMan">
            <div className="tituloMan tituloBotao">
                <h1>Manutenção do Ativo ID </h1>
                <button className='btnManutencao' onClick={toggleModal}>Adicionar pedido de manutenção</button>
            </div>
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
            <div className="buscaFiltro">            
            <select value={Pesquisa} onChange={handleFilterChange} className="mySelect">
                <option value="">Filtro</option>
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
            <TabelaManutencao manutencao={Pesquisando} filtro={Pesquisa} />
        </div >
    );
};
