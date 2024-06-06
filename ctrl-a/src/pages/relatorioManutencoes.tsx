import CampoDropdown from "../components/CampoDropdown"

export default function RelatorioManutencoes({dataInicial, dataFinal} : {dataInicial:string, dataFinal:string}) {
    let ativos = [""]
    const selectAtivos = CampoDropdown("", ativos, "", "Selecione", false)

    return(
        <div className="relatorios-manutencoes">
            {dataInicial}
            {dataFinal}
            <div className="linha1Manutencoes">
                <div className="valorTotalManutencoes">
                    <p>VALOR TOTAL DAS MANUTENÇÕES</p>
                </div>
                <div className="btnsTipoManutencoes">
                    <button className="btnManutencoes">Dados gerais</button>
                    <button className="btnManutencoes">Preventiva</button>
                    <button className="btnManutencoes">Corretiva</button>
                    <button className="btnManutencoes">Preditiva</button>
                </div>
                {selectAtivos.codigo}
            </div>
            <div className="linha2Manutencoes">
                <div className="tempoTipoManutencoes">
                    <p>TEMPO x TIPO DE MANUTENÇÃO</p>
                </div>
                <div className="enviosTipoManutencao">
                    <p>ENVIOS X TIPO DE MANUNTENÇÀO</p>
                </div>
            </div>
        </div>
    )
}