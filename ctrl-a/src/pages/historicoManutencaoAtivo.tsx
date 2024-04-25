import React, { useState, useEffect, ChangeEvent } from 'react';
import './css/historicoManutencao.css'
import Modal from '../components/modal/modal';


interface ManutencaoData {
    id: number;
    // ativo: any;
    tipo: string;
    descricao: string;
    localizacao: string;
    custo: string;
    dataInicio: string;
    dataFim: string;
    excluirManutencao: (manutencaoId: number) => void;
  }

  interface TabelaManutencaoProps {
    manutencao: ManutencaoData[];
    excluirManutencao: (manutencaoId: number) => void;
}  



function LinhaManutencao({ id, tipo, descricao, localizacao,custo, dataInicio, dataFim, excluirManutencao }: ManutencaoData) {
    const [showModal, setShowModal] = useState<boolean>(false);    
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);   

function handleExcluir() {
    excluirManutencao(id);
}

    return (
        <div className="linhaMan"
            onMouseEnter={() => { setIsHovered(true); setShowDeleteButton(true); }}
            onMouseLeave={() => { setIsHovered(false); setShowDeleteButton(false); }}>
            <p className="id">{id}</p>
            <p className="tipo">{tipo}</p>
            {/* <p className="descricao">{descricao}</p> */}
            <p className="local">{localizacao}</p> 
            <p className="custo">{custo}</p>
            <p className="dataInicio">{new Date(dataInicio).toLocaleDateString()}</p>
            <p className="dataFim">{new Date(dataFim).toLocaleDateString()}</p>
        </div>
    )
}

function TabelaManutencao({ manutencao, excluirManutencao }: TabelaManutencaoProps) {
    const linhas = manutencao.map((man: ManutencaoData) => {
        if (man.dataInicio && man.dataFim) {
            return (
                <LinhaManutencao
                    key={man.id}
                    id={man.id}
                    tipo={man.tipo}
                    // ativo={man.ativo}
                    descricao={man.descricao}
                    localizacao={man.localizacao}
                    custo={man.custo}
                    dataInicio={man.dataInicio}
                    dataFim={man.dataFim}
                    excluirManutencao={excluirManutencao} />
            );
        } else {
            console.error(`Manutenção com id ${man.id} não tem dataInicio ou dataFim definida.`);
            return null;
        }
    });

    return (
        <div className="tabelaMan">
            <div className="linhaMan" id="cabecalho">
                <h3 className="id">ID</h3>
                <h3 className="nome">Tipo</h3>
                <h3 className="localizacao">Local</h3> 
                <h3 className="responsavel">Custo</h3>
                <h3 className="tipo">Data de envio</h3>
                <h3 className="status">Data de retorno</h3>                
            </div>
            {linhas}
        </div>
    )
}



export default function HistoricoManutencao() {
    const [manutencaoData, setManutencaoData] = useState<ManutencaoData>({
        id: 1,
        tipo: '',
        // ativo: '',
        descricao: '',
        localizacao: '',
        custo: '',
        dataInicio: '',
        dataFim: '',
        excluirManutencao: () => {} 
    });

    const [manutencao, setManutencao] = useState<ManutencaoData[]>([]);
    const [update, setUpdate] = useState(false);
    const sortedManutencao = [...manutencao].sort((a, b) => a.id - b.id);
    const [Pesquisa, setPesquisa] = useState(''); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPesquisa(event.target.value);    };
    const [showManutencaoModal, setShowManutencaoModal] = useState<boolean>(false);
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    function toggleModal() {
        setShowManutencaoModal(!showManutencaoModal);
   }
    
    function handleManutencaoDataChange(event: React.ChangeEvent<HTMLInputElement>) {
        setManutencaoData({ ...manutencaoData, [event.target.name]: event.target.value });
    }
    const handleTextareaDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setManutencaoData({ ...manutencaoData, [event.target.name]: event.target.value });
    };
    const tipoMapping: { [key: string]: number } = {
        "Preventiva": 1,
        "Corretiva": 2,
        "Preditiva": 3
    };
    
    const handleSelectDataChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tipoValue = tipoMapping[event.target.value];
        setManutencaoData({ ...manutencaoData, [event.target.name]: tipoValue });
    };
    function handleCancel() {
        setShowManutencaoModal(false);
    }

    function handleManutencaoSubmit() {
        let dataInicio = new Date(manutencaoData.dataInicio);
        let dataFim = new Date(manutencaoData.dataFim);
        
        if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
            console.error('Data de início ou fim inválida');
            return;
        }
        
        const manutencaoDataWithDates = {
            ...manutencaoData,
            dataInicio: dataInicio.toISOString(),
            dataFim: dataFim.toISOString()
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
                setManutencao([...manutencao, data]); 
            })
            .catch(error => console.error('Error:', error));
    }
      

    const excluirManutencao = (manutencaoId: number) => {
        fetch(`http://localhost:8080/manutencao/exclusao/${manutencaoId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('Manutencao excluída com sucesso!', manutencaoId);

                setManutencao(manutencao.filter(man => man.id !== manutencaoId));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        console.log('Fetching manutencoes...');
    
        fetch('http://localhost:8080/manutencao/listagemTodos')
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
    }, [update]);
    
    console.log('Manutencoes:', manutencao);

    return (
        <div className="dashboardMan">
            <div className="tituloMan tituloBotao">
            <h1>Manutenção do Ativo ID </h1>
            <button className='btnManutencao' onClick={toggleModal}>Adicionar pedido de manutenção</button>
            </div>
            <Modal open={showManutencaoModal} onClose={handleManutencaoSubmit} onCancel={handleCancel}>
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
                        <select name="tipo" value={manutencaoData.tipo} onChange={handleSelectDataChange}>
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
                        {manutencao.map((manutencao, index) => (
                            <option key={index} value={manutencao.id}> 
                            {manutencao.tipo} 
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
                <TabelaManutencao manutencao={sortedManutencao} excluirManutencao={excluirManutencao} />
        </div>
    );
};
