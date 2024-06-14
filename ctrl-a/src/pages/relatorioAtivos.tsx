import React, { useState, useEffect, useRef } from "react";
import "./css/relatorioAtivos.css";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryPie } from "victory";
import getLocalToken from "../utils/getLocalToken";


interface RelatorioAtivo {
    qtdAtivos: number;
    valorTotal: number;
    qtdPorLocal: Record<string, number>;
    statusNaoAlocado: number;
    statusEmUso: number;
    statusEmManutencao: number;
}

interface Ativo {
    id: number;
    nome: string;
    tipo: "tangível" | "intangível";
    valor: number;
    local: string;
    status: "ativo" | "em uso" | "manutenção";
}

export default function RelatorioAtivos({ dataInicio, dataFim, setDadosAtivos }: { dataInicio: string; dataFim: string; setDadosAtivos: React.Dispatch<React.SetStateAction<Ativo[]>> }) {
    const [relatorioAtivos, setRelatorioAtivos] = useState<RelatorioAtivo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartDataReady, setChartDataReady] = useState(false);

   
    const [localChartData, setLocalChartData] = useState<
        { x: string; y: number }[]
    >([]);
    const [statusData, setStatusData] = useState<
        { x: string; y: number }[]
    >([]);

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
                    `http://localhost:8080/relatorio/relatorioAtivos`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: token,
                        },
                        body: JSON.stringify({
                            dataInicio: dataInicio || null, 
                            dataFim: dataFim || null,     
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

                const data: RelatorioAtivo = await response.json();
                setRelatorioAtivos(data);

                
                if (data) {
                    const localLabels = Object.keys(data.qtdPorLocal);
                    const localData = Object.values(data.qtdPorLocal);

                    setLocalChartData(
                        localLabels.map((label, index) => ({
                            x: label,
                            y: localData[index],
                        }))
                    );

                    setStatusData([
                        { x: "Não Alocado", y: data.statusNaoAlocado * 100 },
                        { x: "Em Uso", y: data.statusEmUso * 100 },
                        { x: "Em Manutenção", y: data.statusEmManutencao * 100 },
                    ]);

                    const dadosAtivos: Ativo[] = Object.keys(data.qtdPorLocal).map(
                        (local) => ({
                            id: 0,
                            nome: `Ativo em ${local}`,
                            tipo: Math.random() < 0.5 ? "tangível" : "intangível",
                            valor: 0,
                            local: local,
                            status: "ativo",
                        })
                    );

                    setDadosAtivos(dadosAtivos);
                    setChartDataReady(true); 
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dataInicio, dataFim]);

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

    if (!relatorioAtivos || Object.keys(relatorioAtivos.qtdPorLocal).length === 0) {
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
                        {relatorioAtivos.valorTotal.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </div>

            <div className="linha2Ativos">
                <div className="statusAtivos">
                    <p>STATUS DOS ATIVOS (%)</p>
                    {chartDataReady && ( 
                        <VictoryPie
                            data={statusData}
                            colorScale={["#FFCE56", "#36A2EB", "#FF6384"]}
                        />
                    )}
                </div>

                <div className="qntdLocalAtivos">
                    <p>QUANTIDADE DE ATIVOS X LOCAL</p>
                    {chartDataReady && ( 
                        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                            <VictoryAxis />
                            <VictoryAxis dependentAxis />
                            <VictoryBar data={localChartData} />
                        </VictoryChart>
                    )}
                </div>
            </div>
        </div>
    );
}
