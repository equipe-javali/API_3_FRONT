import { useState, useEffect } from "react";
import "./css/relatorioAtivos.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);
ChartJS.defaults.color = "#DDD8D8";

interface RelatorioAtivo {
  qtdAtivos: number;
  valorTotal: number;
  qtdPorLocal: Record<string, number>;
  statusNaoAlocado: number;
  statusEmUso: number;
  statusEmManutencao: number;
}

interface RelatorioAtivoProps {
  dataInicio: string;
  dataFim: string;
  onTipoAtivoChange: (tipo: string) => void;
}

export default function RelatorioAtivos({
  dataInicio,
  dataFim,
  onTipoAtivoChange,
}: RelatorioAtivoProps) {
  const [relatorioAtivos, setRelatorioAtivos] = useState<RelatorioAtivo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [localChartData, setLocalChartData] = useState<
    { local: string; qtd: number }[]
  >([]);
  const [statusData, setStatusData] = useState<
    { status: string; qtd: number }[]
  >([]);

  const [selectedButton, setSelectedButton] = useState("DadosGerais");
  let selected = (value: string) => {
    setSelectedButton(value);
    onTipoAtivoChange(value);
  };

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    selected(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem("token")) {
        setError("Token de autenticação não encontrado.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/relatorio/relatorioAtivos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: localStorage.getItem("token") || "",
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
            `Erro na resposta da API: ${response.status} ${response.statusText
            } - ${errorData?.message || "Erro desconhecido"}`
          );
        }

        const data: RelatorioAtivo = await response.json();
        setRelatorioAtivos(data);

        if (data) {
          const localLabels = Object.keys(data.qtdPorLocal);
          const localData = Object.values(data.qtdPorLocal);

          setLocalChartData(
            localLabels.map((label, index) => ({
              local: label,
              qtd: localData[index],
            }))
          );

          setStatusData([
            { status: "Não Alocado", qtd: data.statusNaoAlocado * 100 },
            { status: "Em Uso", qtd: data.statusEmUso * 100 },
            { status: "Em Manutenção", qtd: data.statusEmManutencao * 100 },
          ]);

        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataInicio, dataFim, selectedButton]);

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

  if (!relatorioAtivos) {
    return <p>Nenhum dado encontrado.</p>;
  }

  if (
    !relatorioAtivos ||
    Object.keys(relatorioAtivos.qtdPorLocal).length === 0
  ) {
    return <p>Nenhum dado encontrado para o período selecionado.</p>;
  }

  return (
    <div className="relatorios-ativos">
      <div className="linha1Ativos">
        <div className="totalAtivos">
          <p>TOTAL DE ATIVOS</p>
          <p className="valorCard">{relatorioAtivos.qtdAtivos}</p>
        </div>
        <div className="valorTotalAtivos">
          <p>VALOR TOTAL DE ATIVOS</p>
          <p className="valorCard">
            R${" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
            }).format(relatorioAtivos.valorTotal)}
          </p>
        </div>
        <div className="btnsTiposAtivos">
          <button
            className={
              selectedButton === "DadosGerais"
                ? "btnAtivos btnSelected"
                : "btnAtivos"
            }
            value={"DadosGerais"}
            onClick={handleBtnClick}
          >
            Dados gerais
          </button>
          <button
            className={
              selectedButton === "Tangiveis"
                ? "btnAtivos btnSelected"
                : "btnAtivos"
            }
            value={"Tangiveis"}
            onClick={handleBtnClick}
          >
            Tangíveis
          </button>
          <button
            className={
              selectedButton === "Intangiveis"
                ? "btnAtivos btnSelected"
                : "btnAtivos"
            }
            value={"Intangiveis"}
            onClick={handleBtnClick}
          >
            Intangíveis
          </button>
        </div>
      </div>

      <div className="linha2Ativos">
        <div className="statusAtivos">

          <Pie
            width={200}
            height={100}
            data={{
              labels: statusData.map((status) => status.status),
              datasets: [
                {
                  label: "Quantidade %",
                  data: statusData.map((qtd) => qtd.qtd),
                  backgroundColor: [
                    "#853F85",
                    "#0178D4",
                    "#4152AC",
                  ],
                  borderColor: [
                    "#853F85",
                    "#0178D4",
                    "#4152AC",
                  ],
                  borderWidth: 1,
                  hoverOffset: 20
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  text: "STATUS DOS ATIVOS (%)",
                  display: true,
                  font: { size: 20 },
                },
                legend: {
                  position: 'bottom' as const,
                  labels: {
                    font: { size: 15 },
                  },
                }
              },
            }}
          />

        </div>

        <div className="qntdLocalAtivos">

          <Bar options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'QUANTIDADE POR LOCAL',
              },
            }
          }} data={{
            labels: localChartData.map((local) => local.local),
            datasets: [
              {
                label: "Quantidade",
                data: localChartData.map((qtd) => qtd.qtd),
                backgroundColor: [
                  "#853F85",
                ],
              }
            ]
          }}
          />

        </div>
      </div>
    </div>
  );
}
