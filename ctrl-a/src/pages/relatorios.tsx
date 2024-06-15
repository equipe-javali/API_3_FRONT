import { useState } from "react";
import CampoData from "../components/CampoData";
import RelatorioAtivos from "./relatorioAtivos";
import RelatorioManutencoes from "./relatorioManutencoes";
import "./css/relatorios.css";
import exportDataToExcel from "../components/exportarRelatorios";

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
  dataInicio: string | null; 
  dataFim: string | null;
  ativoId: number;
}


export default function Relatorios() {
  const dataInicial = CampoData("Data inicial:", "data", "", false);
  const dataFinal = CampoData("Data final:", "data", "", false);

  const [changeRelatorio, setChangeRelatorio] = useState("ativos");
  const [dadosAtivos, setDadosAtivos] = useState<Ativo[]>([]);
  const [dadosManutencoes, setDadosManutencoes] = useState<Manutencao[]>([]);

  const handleExport = async () => {
    const dataToExport =
        changeRelatorio === "ativos" ? dadosAtivos : dadosManutencoes;

    const response = await fetch(
      `http://localhost:8080/relatorio/exportRelatorio`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: (localStorage.getItem("token") || "")
        },
        body: JSON.stringify({
          dataInicio: dataInicial.dado || null,
          dataFim: dataFinal.dado || null,
          tipoAtivo: "DadosGerais",
          tipoManutencao: "DadosGerais",
          idAtivo: 213
        }),
        mode: "cors",
      }
    );

    const arquivo = await response.json();

    function downloadLink(): string {
      function binDecode(): Uint8Array {
        const binaryString = window.atob(arquivo.documento);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
          const ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
        }
        return bytes;
      }
      const blob = new Blob([binDecode()], { type: "document/xlsx" });
      return window.URL.createObjectURL(blob);
    }

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = downloadLink();
    a.download = arquivo.nome;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadLink());
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
              className={changeRelatorio === "ativos" ? "btn-borda" : "btn-escolha"}
              onClick={() => setChangeRelatorio("ativos")}
          >
            ATIVOS
          </button>
          <button
              className={
                changeRelatorio === "manutencoes" ? "btn-borda" : "btn-escolha"
              }
              onClick={() => setChangeRelatorio("manutencoes")}
          >
            MANUTENÇÕES
          </button>
          <div className="linha"></div>
        </div>
        <div className="container-relatorios">
          {changeRelatorio === "ativos" ? (
              <RelatorioAtivos
                  dataInicio={dataInicial.dado}
                  dataFim={dataFinal.dado}
                  setDadosAtivos={setDadosAtivos}
              />
          ) : (
              <RelatorioManutencoes
                  dataInicio={dataInicial.dado}
                  dataFim={dataFinal.dado}
                  setDadosManutencoes={setDadosManutencoes}
              />
          )}
        </div>
      </div>
  );
}
