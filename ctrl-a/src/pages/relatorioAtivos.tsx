
export default function RelatorioAtivos({ dataInicial, dataFinal }: { dataInicial: string, dataFinal: string }) {

    return (
        <div className="relatorios-ativos">
            {dataInicial}
            {dataFinal}
            <div className="linha1Ativos">
                <div className="totalAtivos">
                    <p>TOTAL DE ATIVOS</p>
                </div>
                <div className="valorTotalAtivos">
                    <p>VALOR TOTAL DE ATIVOS</p>
                </div>
                <div className="btnsTiposAtivos">
                    <button className="btnAtivos">Dados gerais</button>
                    <button className="btnAtivos">Tangíveis</button>
                    <button className="btnAtivos">Intangíveis</button>
                </div>
            </div>
            <div className="linha2Ativos">
                <div className="statusAtivos">
                    <p>STATUS DOS ATIVOS</p>
                </div>
                <div className="qntdLocalAtivos">
                    <p>QUANTIDADE DE ATIVOS X LOCAL</p>
                </div>
            </div>
        </div>
    )
}