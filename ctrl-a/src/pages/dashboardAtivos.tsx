import React, { useEffect, useState, ChangeEvent } from 'react';
import './css/dashboardAtivos.css';
import Modal from '../components/modal/modal';
import RespostaSistema from '../components/respostaSistema';
import { FaWrench, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type AtivoProps = {
    id: number;
    nome: string;
    idResponsavel: UsuarioProps;
    tipo: string;
    status: string;
    local: string;
    excluirAtivo: (ativoId: number) => void;
    setTextoResposta: (texto: string) => void;
    setTipoResposta: (tipo: string) => void;
}

type UsuarioLoginProps = {
    id: number;
    senha: string;
}

type UsuarioProps = {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    nascimento: string;
    departamento: string;
    telefone: string;
    usuariologin: UsuarioLoginProps[];
};

type ManutencaoProps = {
    id: number;
    idAtivo: AtivoProps;
    dataInicio: string;
    dataFim: string;
    custo: number;
    tipo: number;
    descricao: string;
    localizacao: string;
};

type TabelaAtivosProps<T extends AtivoProps> = {
    ativos: T[];
    excluirAtivo: (ativoId: number) => void;
    setTextoResposta: (texto: string) => void;
    setTipoResposta: (tipo: string) => void;
}

function LinhaAtivo({ id, nome, idResponsavel, tipo, status, local, excluirAtivo, setTextoResposta, setTipoResposta }: AtivoProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [manutencoes, setManutencoes] = useState<ManutencaoProps[]>([]);
    const [usuarios, setUsuarios] = useState<UsuarioProps[]>([]);
    const [selectedUser, setSelectedUser] = useState<UsuarioProps | null>(null);

    function handleCancel() {
        setShowModal(false);
    }

    function handleExcluir() {
        excluirAtivo(id);
    }

    function emManutencao(): boolean {
        if (manutencoes.length <= 0) {
            return false;
        }
        return Date.parse(manutencoes[0].dataInicio) < Date.now() && Date.now() < Date.parse(manutencoes[0].dataFim);
    }

    function localAtivo() {
        if (emManutencao()) {
            return <>{manutencoes[0].localizacao}</>;
        } else if (idResponsavel?.departamento) {
            return <>{idResponsavel.departamento}</>;
        } else {
            return <div><button type="button" className="btnAtribuir" onClick={toggleModal}>Atribuir</button></div>;
        }
    }

    useEffect(() => {
        fetch('http://localhost:8080/usuario/listagemTodos')
            .then(response => {
                if (!response.ok) {
                    setTextoResposta(`Não foi possível listar os ativos! Erro: ${response.status}`);
                    setTipoResposta("Erro");
                }
                return response.json();
            })
            .then(data => setUsuarios(data))
            .catch(error => {
                setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                setTipoResposta("Erro");
            });

        fetch(`http://localhost:8080/manutencao/listagem/${id}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`Não foi possível listar as manutenções do ativo! Erro: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setManutencoes(
                    (data as ManutencaoProps[]).sort((a, b) => Date.parse(a.dataInicio) - Date.parse(b.dataInicio))
                )
            })
            .catch(error => {
                console.error(`Erro ao processar requisição! Erro: ${error}`);
            });
    }, [id, setTextoResposta, setTipoResposta]);

    function toggleModal() {
        if (showModal && selectedUser) {
            fetch(`http://localhost:8080/ativo/associarAtivo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser.id),
            })
                .then(response => {
                    if (response.ok) {
                        setTextoResposta(`Responsável atualizado com sucesso!`);
                        setTipoResposta("Sucesso");
                    }
                    else {
                        setTextoResposta(`Não foi possível associar o ativo! Erro: ${response.status}`);
                        setTipoResposta("Erro");
                    }
                    setShowModal(false);
                })
                .catch(error => {
                    setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                    setTipoResposta("Erro");
                });
        } else {
            setShowModal(!showModal);
        }
    }

    const [statusA, setStatusA] = useState<string>(status);
    useEffect(() => {
        if (idResponsavel?.departamento === null) {
            setStatusA('Não alocado');
        }
        else if (emManutencao()) {
            setStatusA('Em manutenção');
        } else {
            setStatusA('Em uso');
        }
    }, [idResponsavel, manutencoes]);

    function handleUserChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const userId = Number(event.target.value);
        const user = usuarios.find(u => u.id === userId);
        setSelectedUser(user || null);
    }

    return (
        <div className="linhaAtv">
            <p className="id">{id}</p>
            <p className="nome">{nome}</p>
            <p className="responsavel">{idResponsavel ? idResponsavel.nome : 'Não definido'}</p>
            <p className="tipo">{tipo}</p>
            <p className="status">{statusA}</p>
            <p className="local">{localAtivo()}</p>
            <div className="iconContainerAtv">
                <Link to={`/HistoricoManutencao/${id}`}>
                    <button type="button" className="btnIcon">
                        <FaWrench /> 
                    </button>
                </Link>
                <Link to={`/AtualizarAtivo/${id}`}>
                    <button type="button" className="btnIcon">
                        <FaPencilAlt /> 
                    </button>
                </Link>
                <button type="button" className="btnIcon" onClick={handleExcluir}>
                    <FaTrash /> 
                </button>
            </div>
            <Modal open={showModal} onClose={toggleModal} onCancel={handleCancel} title="Atribua seu ativo">
                <>
                    <div className='modal-responsavel'>
                        <h3>Responsável</h3>
                        <select onChange={handleUserChange}>
                            <option value="">Selecione</option>
                            {usuarios.map(usuario => (
                                <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className='modal-local'>
                        <h3>Departamento</h3>
                        <input value={selectedUser?.departamento || ''} readOnly />
                    </div>
                </>
            </Modal>
        </div>
    )
}

function TabelaAtivos({ ativos, excluirAtivo, setTextoResposta, setTipoResposta }: TabelaAtivosProps<AtivoProps>) {
    const linhas = ativos.map((atv) => {
        return (
            <LinhaAtivo
                key={atv.id}
                id={atv.id}
                nome={atv.nome}
                idResponsavel={atv.idResponsavel}
                tipo={atv.tipo}
                status={atv.status}
                local={atv.local}
                excluirAtivo={excluirAtivo}
                setTextoResposta={setTextoResposta}
                setTipoResposta={setTipoResposta} />
        );
    });
    return (
        <div className="tabelaAtv">
            <div className="linhaAtv" id="cabecalho">
                <h3 className="id">ID</h3>
                <h3 className="nome">Nome</h3>
                <h3 className="responsavel">Responsável</h3>
                <h3 className="tipo">Tipo</h3>
                <h3 className="status">Status</h3>
                <h3 className="local">Local</h3>
                <h3 className="acoes">Ações</h3>
            </div>
            {linhas}
        </div>
    );
}

export default function DashboardAtivos() {
    const [ativos, setAtivos] = useState<AtivoProps[]>([]);
    const [textoResposta, setTextoResposta] = useState('');
    const [tipoResposta, setTipoResposta] = useState('');

    const handleResponseTimeout = () => {
        setTextoResposta('');
        setTipoResposta('');
    };

    useEffect(() => {
        if (tipoResposta === 'Sucesso') {
            const timer = setTimeout(handleResponseTimeout, 3000);
            return () => clearTimeout(timer);
        }
    }, [tipoResposta]);

    const sortedAtivos = [...ativos].sort((a, b) => a.id - b.id);

    const [Pesquisa, setPesquisa] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPesquisa(event.target.value);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const excluirAtivo = (ativoId: number) => {
        fetch(`http://localhost:8080/ativo/exclusao/${ativoId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setTextoResposta('Ativo excluído com sucesso!');
                    setTipoResposta('Sucesso');
                } else {
                    setTextoResposta(`Não foi possível deletar! Erro: ${response.status}`);
                    setTipoResposta('Erro');
                }
                setAtivos(ativos.filter(ativo => ativo.id !== ativoId));
            })
            .catch(error => {
                setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                setTipoResposta('Erro');
            });
    };

    useEffect(() => {
        fetch('http://localhost:8080/ativo/listagemTodos')
            .then(response => {
                if (!response.ok) {
                    setTextoResposta(`Não foi possível listar os ativos! Erro: ${response.status}`);
                    setTipoResposta('Erro');
                }
                return response.json();
            })
            .then(data => setAtivos((data as AtivoProps[])))
            .catch(error => {
                setTextoResposta(`Erro ao processar requisição! Erro: ${error}`);
                setTipoResposta('Erro');
            });
    }, []);

    return (
        <div className="dashboardAtv">
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={handleResponseTimeout} />
            <div className="tituloAtv">
                <h1>Ativos</h1>
            </div>
            <div className="buscaFiltro">
                <select value={Pesquisa} onChange={handleFilterChange} className="mySelect">
                    <option value="">Filtro</option>
                    {ativos.map((ativo, index) => (
                        <option key={index} value={ativo.id}>
                            {ativo.tipo}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Buscar por ativo"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="myInput"
                />
            </div>
            <TabelaAtivos ativos={sortedAtivos} excluirAtivo={excluirAtivo} setTextoResposta={setTextoResposta} setTipoResposta={setTipoResposta} />
        </div>
    );
}
