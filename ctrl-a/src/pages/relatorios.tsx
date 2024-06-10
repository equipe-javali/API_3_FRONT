import { useState } from "react";
import CampoData from "../components/CampoData";
import RelatorioAtivos from "./relatorioAtivos";
import RelatorioManutencoes from "./relatorioManutencoes";
import "./css/relatorios.css";
import exportDataToExcel from "../components/exportarRelatorios";
import DadosManutencao from '../components/dadosManutencao'; 

interface Ativo {
    id: number;
    nome: string;
    tipo: "tangível" | "intangível";
    valor: number;
    local: string;
    status: "ativo" | "em uso" | "manutenção";
  }

interface Manutencao {
id: number;
tipo: string;
custo: number;
dataInicio: string;
dataFim: string | null;
ativoId: number;
}
export default function Relatorios() {
  const dataInicial = CampoData("Data inicial:", "data", "", false);
  const dataFinal = CampoData("Data final:", "data", "", false);

  const [changeRelatorio, setChangeRelatorio] = useState("ativos");
  let ativos = () => setChangeRelatorio("ativos");
  let manutencoes = () => setChangeRelatorio("manutencoes");
  const [dadosAtivos, setDadosAtivos] = useState<Ativo[]>([]);
  const [dadosManutencoes, setDadosManutencoes] = useState<Manutencao[]>([]);

  const handleExport = () => {
    const dataToExport =
      changeRelatorio === "ativos"
        ? dadosAtivos 
        : dadosManutencoes; 

    exportDataToExcel(dataToExport);
  };

  return (
    <div className="relatorios">
      <h2>Relatórios</h2>
      <div className="filtro-datas">
        {dataInicial.codigo}
        {dataFinal.codigo}
        <button className="btn-exportar" onClick={handleExport}>
          Exportar
        </button>
      </div>
      <div className="filtro-escolha">
        <button
          className={changeRelatorio == "ativos" ? "btn-borda" : "btn-escolha"}
          onClick={ativos}
        >
          ATIVOS
        </button>
        <button
          className={
            changeRelatorio == "manutencoes" ? "btn-borda" : "btn-escolha"
          }
          onClick={manutencoes}
        >
          MANUTENÇÕES
        </button>
        <div className="linha"></div>
      </div>
      <div className="container-relatorios">
        {changeRelatorio == "ativos" ? (
          <RelatorioAtivos dataInicial={dataInicial.dado} dataFinal={dataFinal.dado} />
        ) : (
          <DadosManutencao dataInicial={dataInicial.dado} dataFinal={dataFinal.dado} /> 
        )}      
      </div>
    </div>
  );
}
