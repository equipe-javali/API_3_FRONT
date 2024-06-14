import React, { useState, useEffect } from "react";
import "./css/relatorioManutencoes.css";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPie } from "victory";
import CampoDropdown from "../components/CampoDropdown";
import getLocalToken from "../utils/getLocalToken";

// Interfaces
interface RelatorioManutencao {
  valorTotal: number;
  mediaTempoPorTipo: Record<string, number>;
  qtdEnvioPorTipo: Record<string, number>; // Mudança aqui
}


// Interface para definir a estrutura dos dados de uma manutenção
interface Manutencao {
  id: number;
  tipo: string;
  custo: number;
  dataInicio: string | null; 
  dataFim: string | null;
  ativoId: number;
}


export default function RelatorioManutencoes({
  dataInicio,
  dataFim, // Corrected prop name
  setDadosManutencoes,
}: {
  dataInicio: string;
  dataFim: string; // Corrected prop name
  setDadosManutencoes: React.Dispatch<React.SetStateAction<Manutencao[]>>;
}) {
  const [relatorioManutencoes, setRelatorioManutencoes] = useState<RelatorioManutencao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAtivo, setSelectedAtivo] = useState<number | null>(null);
  const [selectedAtivoNome, setSelectedAtivoNome] = useState<string>("");
  const [ativos, setAtivos] = useState<{ id: number; nome: string }[]>([]);
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("DadosGerais"); 
  const [enviosPorTipoData, setEnviosPorTipoData] = useState<{ x: string; y: number }[]>([]); 

  const selectAtivos = CampoDropdown(
    "",
    ["Selecione o ativo", ...ativos.map((ativo) => ativo.nome)],
    selectedAtivoNome, // Pass the state string as the initial value
    "Selecione o ativo desejado",
    false,
    "" // helperText empty (or a string if needed)
  );

  const selectTipoRelatorio = CampoDropdown(
    "",
    ["DadosGerais", "Preventiva", "Corretiva", "Preditiva"], // Opções para o tipo de relatório
    tipoRelatorio, // Passa o estado string como valor inicial
    "Selecione o tipo de relatório",
    false,
    "" // helperText vazio (ou uma string se precisar)
  );

  useEffect(() => {
    // Atualiza o estado selectedAtivoNome quando selectedAtivo muda
    if (selectedAtivo) {
      const ativoSelecionado = ativos.find((a) => a.id === selectedAtivo);
      setSelectedAtivoNome(ativoSelecionado ? ativoSelecionado.nome : "");
    } else {
      setSelectedAtivoNome("");
    }
  }, [selectedAtivo, ativos]);

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
              dataInicio: dataInicio,
              dataFim: dataFim,
              tipo: tipoRelatorio,
            }),
            mode: "cors",
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Erro na resposta da API: ${response.status} ${response.statusText} - ${
              errorData?.message || "Erro desconhecido"
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
  
        // Ajuste para obter ativosUnicos (agora que qtdEnvioPorTipo é um objeto)
        const ativosIds = Object.keys(data.qtdEnvioPorTipo).map(Number);
        const ativosUnicos = Array.from(new Set(ativosIds)).map(
          (ativoId) => ({ id: ativoId, nome: `Ativo ${ativoId}` })
        );
        setAtivos(ativosUnicos);
      } catch (error) { // Adiciona o bloco catch para lidar com erros
        console.error("Erro ao buscar dados:", error);
        setError((error as Error).message); // Garante que 'error' seja do tipo Error
      } finally {
        setLoading(false); // Garante que o loading seja finalizado, mesmo com erro
      }
    };
  
    fetchData();
  }, [dataInicio, dataFim, selectedAtivo, tipoRelatorio]);
  

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
