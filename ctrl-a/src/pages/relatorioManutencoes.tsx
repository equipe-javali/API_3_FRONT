import React, { useState, useEffect } from "react";
import "./css/relatorioManutencoes.css";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPie } from "victory";
import CampoDropdown from "../components/CampoDropdown";
import getLocalToken from "../utils/getLocalToken";

interface RelatorioManutencao {
    valorTotal: number;
    mediaTempoPorTipo: Record<string, number>;
    qtdEnvioPorTipo: { tipo: string; ativoId: number; envios: number; dataInicio: string; dataFim: string | null }[];
}


interface Manutencao {
    id: number;
    tipo: string;
    custo: number;
    dataInicio: string;
    dataFim: string | null;
    ativoId: number;
}

export default function RelatorioManutencoes({
                                                 dataInicial,
                                                 dataFim, 
                                                 setDadosManutencoes,
                                             }: {
    dataInicial: string;
    dataFim: string; 
    setDadosManutencoes: React.Dispatch<React.SetStateAction<Manutencao[]>>;
}) {
  const [relatorioManutencoes, setRelatorioManutencoes] = useState<RelatorioManutencao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [selectedAtivo, setSelectedAtivo] = useState<number | null>(null);
    const [selectedAtivoNome, setSelectedAtivoNome] = useState<string>("")
  const [ativos, setAtivos] = useState<{ id: number; nome: string }[]>([]);

    const selectAtivos = CampoDropdown(
        "",
        ["Selecione o ativo", ...ativos.map((ativo) => ativo.nome)],
        selectedAtivoNome, 
        "Selecione o ativo desejado",
        false,
        "" 
    );

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
                idAtivo: selectedAtivo,
                dataInicio: dataInicial,
                dataFim: dataFim,
              }),
              mode: "cors",
            }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
              `Erro na resposta da API: ${response.status} ${response.statusText} - ${errorData?.message || "Erro desconhecido"}`
          );
        }

        const data: RelatorioManutencao = await response.json();
        setRelatorioManutencoes(data);
        setLoading(false);

        
        const ativosUnicos = Array.from(
            new Set(data.qtdEnvioPorTipo.map((item) => item.ativoId))
        ).map((ativoId) => ({ id: ativoId, nome: `Ativo ${ativoId}` }));
        setAtivos(ativosUnicos);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, [dataInicial, dataFim, selectedAtivo]);

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

    const enviosPorTipoData = Object.entries(relatorioManutencoes.qtdEnvioPorTipo).map(
        ([tipo, envios]) => ({ x: tipo, y: envios })
    );

  return (
      <div className="relatorios-manutencoes">
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
        </div>
        {selectAtivos.codigo}

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
