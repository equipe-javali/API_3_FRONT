import { useState } from "react";
import CampoData from "../components/CampoData";
import RelatorioAtivos from "./relatorioAtivos";
import RelatorioManutencoes from "./relatorioManutencoes";
import "./css/relatorios.css";


export default function Relatorios() {
  const dataInicial = CampoData("Data inicial:", "data", "", false);
  const dataFinal = CampoData("Data final:", "data", "", false);
  const [tipoAtivo, setTipoAtivo] = useState("DadosGerais");
  const [tipoManutencao, setTipoManutencao] = useState("DadosGerais");
  const [idAtivo, setIdAtivo] = useState<number | null>(null);

  const [changeRelatorio, setChangeRelatorio] = useState("ativos");

  const handleTipoManutencaoChange = (tipo: string) => {
    setTipoManutencao(tipo)
  
  }
  const handleTipoAtivoChange = (tipo: string) => {
    setTipoAtivo(tipo)
  }
  const handleidAtivoChange = (id: number | null) => {
    setIdAtivo(id)
  }

  const handleExport = async () => {
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
          tipoAtivo: tipoAtivo,
          tipoManutencao: tipoManutencao,
          idAtivo: idAtivo
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
                  onTipoAtivoChange={handleTipoAtivoChange}
              />
          ) : (
            <RelatorioManutencoes
              dataInicio={dataInicial.dado}
              dataFim={dataFinal.dado}
              onTipoManutencaoChange={handleTipoManutencaoChange}
              onIdAtivoChange={handleidAtivoChange}
            />
          )}
        </div>
      </div>
  );
}
