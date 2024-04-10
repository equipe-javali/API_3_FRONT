import React, { useState } from 'react';
import './css/dashboardAtivos.css'

type AtivoProps = {
    id: number;
    nome: string;
    responsavel: string;
    tipo: string;
    status: string;
    local: string;
}

function LinhaAtivo({ id, nome, responsavel, tipo, status, local } : AtivoProps) {
    const [isHovered, setIsHovered] = useState(false);
    const respAtivo = responsavel === '' ? 'Não definido' : responsavel
    const localAtivo = local === '' ? (isHovered ? <><button>Atribuir</button><button>Excluir</button></> : <button>Atribuir</button>) : (isHovered ? <button>Excluir</button> : local);

    let statusA = status
    
    if (local == '') {
        statusA = 'Não alocado'
    }
    if (local == 'TI') {
        statusA = 'Em manutenção'
    } else {
        statusA = 'Em uso'
    }


    return (
        <div className="linhaAtv" 
             onMouseEnter={() => setIsHovered(true)} 
             onMouseLeave={() => setIsHovered(false)}>
            <p className="id">{id}</p>
            <p className="nome">{nome}</p>
            <p className="responsavel">{respAtivo}</p>
            <p className="tipo">{tipo}</p>
            <p className="status">{statusA}</p>
            <p className="local">{localAtivo}</p>
            
        </div>
    )
}

type TabelaAtivosProps<T extends AtivoProps> = {
    ativos: T[];
}

function TabelaAtivos({ ativos } : TabelaAtivosProps<AtivoProps>) {
    const linhas : any = []
    ativos.map((atv) => {
        linhas.push(
            <LinhaAtivo
                key={atv.id}
                id={atv.id}
                nome={atv.nome}
                responsavel={atv.responsavel}
                tipo={atv.tipo}
                status={atv.status}
                local={atv.local} />

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
            </div>
            {linhas}
        </div>
    )
}

const DashboardAtivos: React.FC = () => {
    const ATIVOS: AtivoProps[] = [
        { id: 1, nome: 'Fusca', responsavel: '', tipo: 'Automóvel', status: '', local: '' },
        { id: 2, nome: 'Carro', responsavel: 'Rosana', tipo: 'Automóvel', status: '', local: 'Desenvolvimento, SJC - SP' },
        { id: 3, nome: 'Impressora', responsavel: 'Herman', tipo: 'Eletrônico', status: '', local: 'TI' }
    ];

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
            <TabelaAtivos ativos={ATIVOS} />
        </div>
    );
};

export default DashboardAtivos;
