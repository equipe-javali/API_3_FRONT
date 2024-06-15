import React, { useState, useEffect } from "react";
import "./css/relatorioManutencoes.css";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPie } from "victory";
import CampoDropdown from "../components/CampoDropdown";
import getLocalToken from "../utils/getLocalToken";

interface RelatorioManutencao {
  valorTotal: number;
  mediaTempoPorTipo: Record<string, number>;
  qtdEnvioPorTipo: Record<string, number>;
}

interface Manutencao {
  id: number;
  tipo: string;
  custo: number;
  dataInicio: string | null;
  dataFim: string | null;
  ativoId: number;
}


export default function RelatorioManutencoes({dataInicio, dataFim, setDadosManutencoes,}: {dataInicio: string, dataFim: string, setDadosManutencoes: React.Dispatch<React.SetStateAction<Manutencao[]>>}) {
  const [relatorioManutencoes, setRelatorioManutencoes] = useState<RelatorioManutencao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAtivo, setSelectedAtivo] = useState<number | null>(null);
  const [selectedAtivoNome, setSelectedAtivoNome] = useState<string>("");
  const [enviosPorTipoData, setEnviosPorTipoData] = useState<{ x: string; y: number }[]>([]);
  
  let ativos = ["Todos os ativos"]
  const selectAtivos = CampoDropdown( "", ativos, "", "Selecione o ativo desejado", false);

  const [selectedButton, setSelectedButton] = useState("DadosGerais")
  let selected = (value: string) => { setSelectedButton(value) }

  useEffect(() => {
    const fetchData = async () => {
      const token = getLocalToken();

      if (!token) {
        setError("Token de autenticação não encontrado.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/relatorio/relatorioManutencoes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              dataInicio: dataInicio,
              dataFim: dataFim,
              tipo: selectedButton,
            }),
            mode: "cors",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Erro na resposta da API: ${response.status} ${response.statusText} - ${errorData?.message || "Erro desconhecido"
            }`
          );
        }

        const data: RelatorioManutencao = await response.json();
        setRelatorioManutencoes(data);
        setLoading(false);

        // Converter qtdEnvioPorTipo (objeto) para array para o gráfico
        const enviosPorTipoArray = Object.entries(data.qtdEnvioPorTipo).map(
          ([tipo, envios]) => ({ x: tipo, y: envios })
        );
        setEnviosPorTipoData(enviosPorTipoArray);

        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataInicio, dataFim, selectedAtivo, selectedButton]);


  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Erro ao carregar os dados do relatório:</p>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!relatorioManutencoes) {
    return <p>Nenhum dado encontrado.</p>;
  }


  const tempoPorTipoData = Object.entries(relatorioManutencoes.mediaTempoPorTipo).map(
    ([tipo, tempo]) => ({ x: tipo, y: Math.round(tempo) })
  );




  return (
    <div className="relatorios-manutencoes">
      {dataInicio}
      {dataFim}
      <div className="linha1Manutencoes">
        <div className="valorTotalManutencoes">
          <p>VALOR TOTAL DAS MANUTENÇÕES</p>
          <p className="valorCard">
            R${" "}
            {relatorioManutencoes.valorTotal.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="btnsTipoManutencoes">
          <div className="linha1btns">
            <button className={selectedButton == "DadosGerais" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"DadosGerais"} onClick={() => {selected("DadosGerais")}}>Dados gerais</button>
            <button className={selectedButton == "Preventiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"Preventiva"} onClick={() => selected("Preventiva")}>Preventiva</button>
          </div>
          <div className="linha2btns">
            <button className={selectedButton == "Corretiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"Corretiva"} onClick={() => selected("Corretiva")}>Corretiva</button>
            <button className={selectedButton == "Preditiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"Preditiva"} onClick={() => selected("Preditiva")}>Preditiva</button>
          </div>
        </div>
        {selectAtivos.codigo}
      </div>

      <div className="linha2Manutencoes">
        <div className="tempoTipoManutencoes">
          <p>TEMPO MÉDIO POR TIPO DE MANUTENÇÃO (DIAS)</p>
          <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
            <VictoryAxis />
            <VictoryAxis dependentAxis />
            <VictoryBar data={tempoPorTipoData} />
          </VictoryChart>
        </div>


        <div className="enviosTipoManutencao">
          <p>ENVIOS X TIPO DE MANUTENÇÃO</p>
          <VictoryPie data={enviosPorTipoData} />
        </div>
      </div>
    </div>
  );
}
