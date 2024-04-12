import React, { useEffect, useState } from 'react';
import './css/dashboardAtivos.css'
import Modal from '../components/modal/modal';

type AtivoProps = {
    id: number;
    nome: string;
    idResponsavel: UsuarioProps;
    tipo: string;
    status: string;
    local: string;
    excluirAtivo: (ativoId: number) => void; 
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
}

type TabelaAtivosProps<T extends AtivoProps> = {
    ativos: T[];
    excluirAtivo: (ativoId: number) => void;
}

function LinhaAtivo({ id, nome, idResponsavel, tipo, status, local, excluirAtivo } : AtivoProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [usuarios, setUsuarios] = useState<UsuarioProps[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    

    const localAtivo = (
        <div>
            {idResponsavel?.departamento && !isHovered && idResponsavel.departamento}
            {!idResponsavel?.departamento || isHovered ? (
                <>
                    {!idResponsavel?.departamento && <button type='button' className='btnAtribuir' onClick={toggleModal}>Atribuir</button>}
                    <button type='button' className='btnAtribuir' onClick={handleExcluir}>Excluir</button>
                </>
            ) : null}
        </div>
    )
    useEffect(() => {
        fetch('http://localhost:8080/usuario/listagemTodos')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => setUsuarios(data))
            .catch(error => console.error('Error:', error));
    }, []);

    function toggleModal() {setShowModal(!showModal);}

    function handleExcluir() {
        excluirAtivo(id);
    }

    let statusA = status
    if (idResponsavel && idResponsavel.departamento == '') {
        statusA = 'Não alocado'
    }
    else if (idResponsavel && idResponsavel.departamento == 'TI') {
        statusA = 'Em manutenção'
    } else {
        statusA = 'Em uso'
    }

    return (
        <div className="linhaAtv" 
             onMouseEnter={() => {setIsHovered(true); setShowDeleteButton(true);}} 
             onMouseLeave={() => {setIsHovered(false); setShowDeleteButton(false);}}>
            <p className="id">{id}</p>
            <p className="nome">{nome}</p>
            <p className="responsavel">{idResponsavel ? idResponsavel.nome : 'N/A'}</p>
            <p className="tipo">{tipo}</p>
            <p className="status">{statusA}</p>
            <p className="local">{localAtivo}</p>
            <Modal open={showModal} onClose={toggleModal}>
                <>
                    <div className='modal-responsavel'>
                        <h3>Responsável</h3>
                        <select>
                        {usuarios.map(usuario => (
                            <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                        ))}
                        </select>
                    </div>
                    <div className='modal-local'>
                        <h3>Departamento</h3>
                        <input placeholder='Onde se encontra o ativo...' />
                    </div>
                </>

            </Modal>
        </div>
    )
}

function TabelaAtivos({ ativos, excluirAtivo } : TabelaAtivosProps<AtivoProps>) {
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
                excluirAtivo={excluirAtivo} /> // Adicione esta linha
        );
    });

    return (
        <div className="tabelaAtv">
            <div className="linhaAtv" id="cabecalho">
                <h3 className="id">ID</h3>
                <h3 className="nome">Nome</h3>
                <h3 className="responsavel">Responsavel</h3>
                <h3 className="tipo">Tipo</h3>
                <h3 className="status">Status</h3>
                <h3 className="local">Local</h3>
            </div>
            {linhas}
        </div>
    )

}

export default function DashboardAtivos() {

    const [ativos, setAtivos] = useState<AtivoProps[]>([]); 
    const [update, setUpdate] = useState(false);
    
    const excluirAtivo = (ativoId: number) => {
        fetch(`http://localhost:8080/ativo/exclusao/${ativoId}`, { 
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Ativo excluído com sucesso!', ativoId);
                
            setAtivos(ativos.filter(ativo => ativo.id !== ativoId));
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
    useEffect(() => {
        fetch('http://localhost:8080/ativo/listagemTodos')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => setAtivos(data))
          .catch(error => console.error('Error:', error));
      }, [update]);

    return (
        <div className="dasboardAtv">
            <div className="tituloAtv">
                <h1>Ativos</h1>
            </div>
            <div className="buscaFiltro">
                <select>
                    <option>Nome</option>
                    <option>Responsável</option>
                </select>
                <input/>
            </div>
            <TabelaAtivos ativos={ativos} excluirAtivo={excluirAtivo} />
        </div>
    );
};
