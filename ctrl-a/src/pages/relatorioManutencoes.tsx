import React, { useState, useEffect } from "react";
import "./css/relatorioManutencoes.css";
import { Chart as ChartJS, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement, } from "chart.js";
import { Bar } from "react-chartjs-2";
import CampoDropdown from "../components/CampoDropdown";
import getLocalToken from "../utils/getLocalToken";
ChartJS.register( CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);
ChartJS.defaults.color = "#DDD8D8"

interface RelatorioManutencao {
  valorTotal: number;
  mediaTempoPorTipo: Record<string, number>;
  qtdEnvioPorTipo: Record<string, number>;
}

interface RelatorioManutencaoProps {
  dataInicio: string,
  dataFim: string,
  onTipoManutencaoChange: (tipo: string) => void,
  onIdAtivoChange: (id: number | null) => void
}

export default function RelatorioManutencoes({ dataInicio, dataFim, onTipoManutencaoChange, onIdAtivoChange }: RelatorioManutencaoProps) {
  const [relatorioManutencoes, setRelatorioManutencoes] = useState<RelatorioManutencao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enviosPorTipoData, setEnviosPorTipoData] = useState<{ tipo: string; qtd: number }[]>([]);

  const [selectedButton, setSelectedButton] = useState("DadosGerais")
  let selected = (value: string) => { setSelectedButton(value); onTipoManutencaoChange(value) }

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    selected(value);
  };

  const [ativos, setAtivos] = useState<{ id: number, nome: string }[]>([])
  const opcoesAtivos = ["Todos os ativos", ...ativos.map(ativo => ativo.nome)]
  const selectAtivos = CampoDropdown("", opcoesAtivos, "", "Selecione o ativo desejado...", false);
  const [idAtivoSelecionado, setIdAtivoSelecionado] = useState<number | null>(null)

  let selectedAtivo = (nomeAtivo: string) => {
    let ativo = ativos.find(a => a.nome == nomeAtivo)
    setIdAtivoSelecionado(ativo ? ativo.id : null)
  }
  onIdAtivoChange(idAtivoSelecionado)

  useEffect(() => {
    selectedAtivo(selectAtivos.dado)
  }, [selectAtivos.dado])

  const tipoMap: Record<string, string> = {
    "1": "Preventiva",
    "2": "Corretiva",
    "3": "Preditiva"
  }

  useEffect(() => {
    const listagemAtivos = async () => {
      try {
        const reqData = await fetch("http://localhost:8080/ativo/listagemTodos",
          {
            method: "GET",
            headers: {
              Authorization: (localStorage.getItem("token") || ""),
            }
          }
        )
        if (!reqData.ok) {
          const errorData = await reqData.json();
          throw new Error(
            `Erro na listagem de ativos: ${reqData.status} ${reqData.statusText} - ${errorData?.message || "Erro desconhecido"}`
          );
        }

        const responseData = await reqData.json();
        const getAtivos = responseData.map((ativo: any) => ({ id: ativo!.id, nome: ativo!.nome }))

        setAtivos(getAtivos)

      } catch (err) {
        console.log('Erro ao listar ativos', err)
      } finally {
        setLoading(false)
      }
    }

    listagemAtivos();
  }, [])


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
              idAtivo: idAtivoSelecionado
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

        const mediaTempoTraduzido = Object.fromEntries(
          Object.entries(data.mediaTempoPorTipo).map(([key, value]) => [tipoMap[key], value])
        )
        const qtdEnvioTraduzido = Object.fromEntries(
          Object.entries(data.qtdEnvioPorTipo).map(([key, value]) => [tipoMap[key], value])
        )

        setRelatorioManutencoes({
          ...data,
          mediaTempoPorTipo: mediaTempoTraduzido,
          qtdEnvioPorTipo: qtdEnvioTraduzido
        });

        setLoading(false);

        const enviosPorTipoArray = Object.entries(qtdEnvioTraduzido).map(
          ([tipo, envios]) => ({ tipo: tipo, qtd: envios })
        );
        setEnviosPorTipoData(enviosPorTipoArray);
        console.log(enviosPorTipoArray)

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataInicio, dataFim, selectedButton, idAtivoSelecionado]);




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
        <div className="btnsTipoManutencoes">
          <div className="linha1btns">
            <button className={selectedButton == "DadosGerais" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"DadosGerais"} onClick={handleBtnClick}>Dados gerais</button>
            <button className={selectedButton == "Preventiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"Preventiva"} onClick={handleBtnClick}>Preventiva</button>
          </div>
          <div className="linha2btns">
            <button className={selectedButton == "Corretiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"Corretiva"} onClick={handleBtnClick}>Corretiva</button>
            <button className={selectedButton == "Preditiva" ? "btnManutencoes btnSelected" : "btnManutencoes"} value={"Preditiva"} onClick={handleBtnClick}>Preditiva</button>
          </div>
        </div>
        {selectAtivos.codigo}
      </div>

      <div className="linha2Manutencoes">
        <div className="tempoTipoManutencoes">
        <Bar options={{
          indexAxis: 'y' as const,
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'MÉDIA DE TEMPO POR TIPO DE MANUTENÇÃO',
              },
            }
          }} data={{
            labels: tempoPorTipoData.map((tipo) => tipo.x),
            datasets: [
              {
                label: "Dias",
                data: tempoPorTipoData.map((dias) => dias.y),
                backgroundColor: [
                  "#853F85",
                ],
              }
            ]
          }}
          />
        </div>

        <div className="enviosTipoManutencao">
          <Bar options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'ENVIOS POR TIPO DE MANUTENÇÃO',
              },
            }
          }} data={{
            labels: enviosPorTipoData.map((tipo) => tipo.tipo),
            datasets: [
              {
                label: "Envios",
                data: enviosPorTipoData.map((qtd) => qtd.qtd),
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
  )
}
