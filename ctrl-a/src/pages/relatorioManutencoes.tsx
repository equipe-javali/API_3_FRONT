import { useState } from "react"
import CampoDropdown from "../components/CampoDropdown"
import "./css/relatorioManutencoes.css"

export default function RelatorioManutencoes({ dataInicial, dataFinal }: { dataInicial: string, dataFinal: string }) {
    let ativos = ["Todos os ativos"] //Ao fazer o fetch adicionar ativos.push(json com nome de ativos)
    const selectAtivos = CampoDropdown("", ativos, "", "Selecione o ativo desejado", false)

    const [selectedButton, setSelectedButton] = useState("geral")
    let selected = (value: string) => { setSelectedButton(value) }

    return (
        <div className="relatorios-manutencoes">
            {/* variáveis para manipular as datas selecionadas no filtro */}
            {/* quando criar o fetch, utilizar estas variáveis para a filtragem */}
            {dataInicial}
            {dataFinal}
            <div className="linha1Manutencoes">
                <div className="valorTotalManutencoes">
                    <p>VALOR TOTAL DAS MANUTENÇÕES</p>
                    <p className="valorCard">R$2000,00</p>
                </div>
                <div className="btnsTipoManutencoes">
                    <div className="linha1btns">
                        <button className={selectedButton == "geral" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"geral"} onClick={() => selected("geral")}>Dados gerais</button>
                        <button className={selectedButton == "preventiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"preventiva"} onClick={() => selected("preventiva")}>Preventiva</button>
                    </div>
                    <div className="linha2btns">
                        <button className={selectedButton == "corretiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"corretiva"} onClick={() => selected("corretiva")}>Corretiva</button>
                        <button className={selectedButton == "preditiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"preditiva"} onClick={() => selected("preditiva")}>Preditiva</button>
                    </div>
                </div>
                {selectAtivos.codigo}
            </div>
            <div className="linha2Manutencoes">
                <div className="tempoTipoManutencoes">
                    <p>TEMPO x TIPO DE MANUTENÇÃO</p>
                    <div className="graficoManutencoes"></div>
                </div>
                <div className="enviosTipoManutencao">
                    <p>ENVIOS X TIPO DE MANUNTENÇÀO</p>
                    <div className="graficoManutencoes"></div>
                </div>
            </div>
        </div>
    )
}