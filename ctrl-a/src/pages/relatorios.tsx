import { useState } from "react"
import CampoData from "../components/CampoData"
import RelatorioAtivos from "./relatorioAtivos"
import RelatorioManutencoes from "./relatorioManutencoes"
import "./css/relatorios.css"

export default function Relatorios() {
    const dataInicial = CampoData("Data inicial:", "data", "", false)
    const dataFinal = CampoData("Data final:", "data", "", false)

    const [changeRelatorio, setChangeRelatorio] = useState("ativos")
    let ativos = () => setChangeRelatorio("ativos")
    let manutencoes = () => setChangeRelatorio("manutencoes")
    
    return(
        <div className="relatorios">
            <h2>Relatórios</h2>
            <div className="filtro-datas">
                {dataInicial.codigo}
                {dataFinal.codigo}
                <button className="btn-exportar">Exportar</button>
            </div>
            <div className="filtro-escolha">
                <button className={changeRelatorio == "ativos" ? "btn-borda" : "btn-escolha"} onClick={ativos}>ATIVOS</button>
                <button className={changeRelatorio == "manutencoes" ? "btn-borda" : "btn-escolha"} onClick={manutencoes}>MANUTENÇÕES</button>
                <div className="linha"></div>
            </div>
            <div className="container-relatorios">
                {changeRelatorio == "ativos" ? 
                <RelatorioAtivos dataInicial={dataInicial.dado} dataFinal={dataFinal.dado} /> 
                : <RelatorioManutencoes dataInicial={dataInicial.dado} dataFinal={dataFinal.dado}/>}
            </div>
        </div>
    )
}