import './dashboardAtv.css';

export default function dashboardAtv() {
    return (
        <>
            <div className="dashboard">
                <div className="cabecalho">
                    <h1>Ativos</h1>
                    <div className="busca">
                        <select>
                            <option>Nome</option>
                            <option>Tipo</option>
                        </select>
                        <input/>
                    </div>
                </div>
                <div className="tabela">
                    <div className="linha cabecalho">
                        <h3 className="id">ID</h3>
                        <h3 className="nome">Nome</h3>
                        <h3 className="responsavel">Responsável</h3>
                        <h3 className="tipo">Tipo</h3>
                        <h3 className="status">Status</h3>
                        <h3 className="local">Local</h3>
                    </div>
                    <div className="linha">
                        <p className="id">#1</p>
                        <p className="nome">Fusca fafa</p>
                        <p className="responsavel">Não definido</p>
                        <p className="tipo">Automóvel</p>
                        <p className="status">Não alocado</p>
                        <p className="local"><button>Atribuir</button></p>
                    </div>
                    <div className="linha">
                        <p className="id">#2</p>
                        <p className="nome">Notebook HP Elitebook</p>
                        <p className="responsavel">Rosana</p>
                        <p className="tipo">Eletrônico</p>
                        <p className="status">Em uso</p>
                        <p className="local">Dept: Administrativo, SJC - SP</p>
                    </div>
                    <div className="linha">
                        <p className="id">#3</p>
                        <p className="nome">Impressora</p>
                        <p className="responsavel">Herman</p>
                        <p className="tipo">Eletrônico</p>
                        <p className="status">Em manutenção</p>
                        <p className="local">Dept: Administrativo, SP - SP</p>
                    </div>
                </div>
            </div>
        </>
    )

}