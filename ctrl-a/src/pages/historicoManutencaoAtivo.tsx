import React, { useState, useEffect, ChangeEvent } from 'react';
import './css/historicoManutencao.css'
import Modal from '../components/modal/modal';

type ManutencaoProps = {
    id: number;
    tipo: string;
    custo: number;
    dataEnvio: Date;
    dataRetorno: Date;
    excluirManutencao: (manutencaoId: number) => void;
}

type TabelaManutencaoProps = {
    manutencao: ManutencaoProps[];
    excluirManutencao: (manutencaoId: number) => void;
}



function LinhaManutencao({ id, tipo, custo, dataEnvio, dataRetorno, excluirManutencao }: ManutencaoProps) {
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
            <p className="custo">{custo}</p>
            <p className="dataEnvio">{dataEnvio.toLocaleDateString()}</p>
            <p className="dataRetorno">{dataRetorno.toLocaleDateString()}</p>
        </div>
    )
}

function TabelaManutencao({ manutencao, excluirManutencao }: TabelaManutencaoProps) {
    const linhas = manutencao.map((man: ManutencaoProps) => {
        return (
            <LinhaManutencao
                key={man.id}
                id={man.id}
                tipo={man.tipo}
                custo={man.custo}
                dataEnvio={man.dataEnvio}
                dataRetorno={man.dataRetorno}
                excluirManutencao={excluirManutencao} />
        );
    });

    return (
        <div className="tabelaMan">
            <div className="linhaMan" id="cabecalho">
                <h3 className="id">ID</h3>
                <h3 className="nome">Tipo</h3>
                <h3 className="responsavel">Custo</h3>
                <h3 className="tipo">Data de envio</h3>
                <h3 className="status">Data de retorno</h3>                
            </div>
            {linhas}
        </div>
    )
}

export default function HistoricoManutencao() {

    const [manutencao, setManutencao] = useState<ManutencaoProps[]>([]);
    const [update, setUpdate] = useState(false);
    const sortedManutencao = [...manutencao].sort((a, b) => a.id - b.id);
    const [Pesquisa, setPesquisa] = useState(''); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPesquisa(event.target.value);    };
    
    const [manutencaoData, setManutencaoData] = useState({ tipo: '', descricao: '' });
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
    function handleCancel() {
        setShowManutencaoModal(false);
    }

    function handleManutencaoSubmit() {
        fetch('http://localhost:8080/manutencao/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(manutencaoData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('Manutenção cadastrada com sucesso!');
                setShowManutencaoModal(false);
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
        fetch('http://localhost:8080/manutencao/listagemTodos')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setManutencao(data))
            .catch(error => console.error('Error:', error));
    }, [update]);

    return (
        <div className="dashboardMan">
            <div className="tituloMan tituloBotao">
            <h1>Manutenção do Ativo ID </h1>
            <button className='btnManutencao' onClick={toggleModal}>Adicionar pedido de manutenção</button>
            </div>
                <Modal open={showManutencaoModal} onClose={toggleModal} onCancel={handleCancel}>
                    <>
                    <div className="containerModal">
                        <div className='modal-man'>
                            <h3>Local</h3>
                            <input name="tipo" value={manutencaoData.tipo} onChange={handleManutencaoDataChange} />
                        </div>
                        <div className='modal-man'>
                            <h3>Custo</h3>
                            <input name="descricao" value={manutencaoData.descricao} onChange={handleManutencaoDataChange} />
                        </div>
                    </div>
                    <div className="containerModal">
                        <div className='modal-man'>
                            <h3>Data de envio</h3>
                            <input name="tipo" value={manutencaoData.tipo} onChange={handleManutencaoDataChange} />
                        </div>
                        <div className='modal-man'>
                            <h3>Data de retorno</h3>
                            <input name="descricao" value={manutencaoData.descricao} onChange={handleManutencaoDataChange} />
                        </div>
                    </div>
                    <div className="containerModal">
                        <div className='modal-man'>
                            <h3>Descrição</h3>
                            <input name="tipo" value={manutencaoData.tipo} onChange={handleManutencaoDataChange} />
                        </div>
                        <div className='modal-man'>
                            <h3>Tipo</h3>
                            <input name="descricao" value={manutencaoData.descricao} onChange={handleManutencaoDataChange} />
                        </div>
                    </div>
                    </>
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
