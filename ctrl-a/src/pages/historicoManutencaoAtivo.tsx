import React, { useEffect, useState } from 'react';
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
        <div className="dasboardMan">
            <div className="tituloMan">
                <h1>Ativos</h1>
            </div>
            <div className="buscaFiltro">
                <select>
                    <option>Nome</option>
                    <option>Responsável</option>
                </select>
                <input />
            </div>
            <TabelaManutencao manutencao={sortedManutencao} excluirManutencao={excluirManutencao} />
        </div>
    );
};
// import React, { useEffect, useState } from 'react';
// import './css/dashboardAtivos.css'
// import Modal from '../components/modal/modal';

// type ManutencaoProps = {
//     id: number;
//     tipo: string;
//     custo: number;
//     dataEnvio: Date;
//     dataRetorno: Date;
//     excluirManutencao: (manutencaoId: number) => void;
// }

// type TabelaManutencaoProps = {
//     manutencao: ManutencaoProps[];
//     excluirManutencao: (manutencaoId: number) => void;
// }

// function LinhaManutencao({ id, tipo, custo, dataEnvio, dataRetorno, excluirManutencao }: ManutencaoProps) {
//     const [showModal, setShowModal] = useState<boolean>(false);    
//     const [isHovered, setIsHovered] = useState(false);
//     const [showDeleteButton, setShowDeleteButton] = useState(false);   

//     function handleExcluir() {
//         excluirManutencao(id);
//     }

//     return (
//         <div className="linhaManutencao"
//             onMouseEnter={() => { setIsHovered(true); setShowDeleteButton(true); }}
//             onMouseLeave={() => { setIsHovered(false); setShowDeleteButton(false); }}>
//             <p className="id">{id}</p>
//             <p className="tipo">{tipo}</p>
//             <p className="custo">{custo}</p>
//             <p className="dataEnvio">{dataEnvio.toLocaleDateString()}</p>
//             <p className="dataRetorno">{dataRetorno.toLocaleDateString()}</p>
//         </div>
//     )
// }

// function handleExcluir() {
//     excluirManutencao(id);
// }

       

    
 

// function TabelaManutencao({ manutencao, excluirManutencao }: TabelaManutencaoProps) {
//     const linhas = manutencao.map((man: ManutencaoProps) => {
//         return (
//             <LinhaManutencao
//                 key={man.id}
//                 id={man.id}
//                 tipo={man.tipo}
//                 custo={man.custo}
//                 dataEnvio={man.dataEnvio}
//                 dataRetorno={man.dataRetorno}
//                 excluirManutencao={excluirManutencao} />
//         );
//     });

//     return (
//         <div className="tabelaManutencao">
//             <div className="linhaAtv" id="cabecalho">
//                 <h3 className="id">ID</h3>
//                 <h3 className="nome">Nome</h3>
//                 <h3 className="responsavel">Responsavel</h3>
//                 <h3 className="tipo">Tipo</h3>
//                 <h3 className="status">Status</h3>
//                 <h3 className="local">Local</h3>
//             </div>
//             {linhas}
//         </div>
//     )
// }

// export default function HistoricoManutencao() {

//     const [ativos, setAtivos] = useState<ManutencaoProps[]>([]);
//     const [update, setUpdate] = useState(false);
//     const sortedAtivos = [...ativos].sort((a, b) => a.id - b.id);

//     const excluirAtivo = (ativoId: number) => {
//         fetch(`http://localhost:8080/ativo/exclusao/${ativoId}`, {
//             method: 'DELETE',
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 console.log('Ativo excluído com sucesso!', ativoId);

//                 setAtivos(ativos.filter(ativo => ativo.id !== ativoId));
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
//     }

//     useEffect(() => {
//         fetch('http://localhost:8080/ativo/listagemTodos')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => setAtivos(data))
//             .catch(error => console.error('Error:', error));
//     }, [update]);

//     return (
//         <div className="dasboardAtv">
//             <div className="tituloAtv">
//                 <h1>Ativos</h1>
//             </div>
//             <div className="buscaFiltro">
//                 <select>
//                     <option>Nome</option>
//                     <option>Responsável</option>
//                 </select>
//                 <input />
//             </div>
//             <TabelaManutencao manutencao={sortedManutencao} excluirManutencao={excluirManutencao} />
//         </div>
//     );
// };

   // function toggleModal() {
    //     if (showModal && selectedUser) {
    //         fetch(`http://localhost:8080/ativo/associarAtivo/${id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(selectedUser.id),
    //         })
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error(`HTTP error! status: ${response.status}`);
    //                 }
    //                 console.log('Responsável atualizado com sucesso!');
    //                 setShowModal(false);
    //             })
    //             .catch(error => console.error('Error:', error));
    //     } else{
    //         setShowModal(!showModal);
    //     }
    // }

    // let statusA = status
    // if (idResponsavel?.departamento == null) {
    //     statusA = 'Não alocado'
    // }
    // else if (idResponsavel.departamento == 'TI') {
    //     statusA = 'Em manutenção'
    // } else {
    //     statusA = 'Em uso'
    // }


   
    // const [selectedUserDepartment, setSelectedUserDepartment] = useState<string | null>(null);

    // function handleUserChange(event: React.ChangeEvent<HTMLSelectElement>) {
    //     const userId = Number(event.target.value);
    //     const user = usuarios.find(u => u.id === userId);
    //     setSelectedUser(user || null);
    //     setSelectedUserDepartment(user ? user.departamento : null);
    // }

    // useEffect(() => {
    //     if (!showModal && selectedUser) {
    //         window.location.reload();
    //     }
    // }, [showModal, selectedUser]);

    // return (
    //     <div className="linhaManutencao"
    //         onMouseEnter={() => { setIsHovered(true); setShowDeleteButton(true); }}
    //         onMouseLeave={() => { setIsHovered(false); setShowDeleteButton(false); }}>
    //         <p className="id">{id}</p>
    //         <p className="tipo">{tipo}</p>
    //         <p className="custo">{custo}</p>
    //         <p className="dataEnvio">{dataEnvio}</p>
    //         <p className="dataRetorno">{dataRetorno}</p>
            /*{ <Modal open={showModal} onClose={toggleModal}>
                <>
                    <div className='modal-responsavel'>
                        <h3>Responsável</h3>
                        <select onChange={handleUserChange}>
                            {usuarios.map(usuario => (
                                <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className='modal-local'>
                        <h3>Departamento</h3>
                        <input value={selectedUserDepartment || ''} readOnly />
                    </div>
                </>
            </Modal> }
            
            {/* <p className="responsavel">{idResponsavel ? idResponsavel.nome : 'Não definido'}</p>
            <p className="tipo">{tipo}</p>
            <p className="status">{statusA}</p>
            <p className="local">{localAtivo}</p>
            <Modal open={showModal} onClose={toggleModal}>
                <>
                    <div className='modal-responsavel'>
                        <h3>Responsável</h3>
                        <select onChange={handleUserChange}>
                            {usuarios.map(usuario => (
                                <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className='modal-local'>
                        <h3>Departamento</h3>
                        <input value={selectedUserDepartment || ''} readOnly />
                    </div>
                </>
            </Modal> }
//         </div>
//     )
// }*/