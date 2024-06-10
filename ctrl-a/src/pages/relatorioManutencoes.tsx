import React, { useState, useEffect, useCallback, useRef } from "react";
import "./css/relatorioManutencoes.css";
import CampoDropdown from "../components/CampoDropdown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Manutencao {
  id: number;
  tipo: string;
  custo: number;
  dataInicio: string;
  dataFim: string | null;
  ativoId: number;
}

interface Ativo {
  id: number;
  nome: string;
}

interface RelatorioManutencoesProps {
    dadosManutencoes: Manutencao[];
    dataInicial: string;  
    dataFinal: string;
  }

  export default function RelatorioManutencoes({
    dadosManutencoes,
    dataInicial,
    dataFinal,
  }: RelatorioManutencoesProps) {
    const [selectedAtivo, setSelectedAtivo] = useState<number | undefined>(
      undefined
    );
    const [selectedButton, setSelectedButton] = useState("geral");
    const [chartData, setChartData] = useState<{
        dadosTempoTipo: { tipo: string; tempo: number }[];
        dadosEnviosTipo: { tipo: string; envios: number }[];
        loading: boolean;
        error: string | null;
      }>({
        dadosTempoTipo: [],
        dadosEnviosTipo: [],
        loading: true, 
        error: null,
      });
    const totalManutencoes = dadosManutencoes.length;
    const valorTotalManutencoes = dadosManutencoes.reduce((acc, manutencao) => acc + manutencao.custo, 0);
    
    const [ativos, setAtivos] = useState<Ativo[]>([]);
    const [loading, setLoading] = useState(true); 
    const isMountedRef = useRef(false);
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    
      useEffect(() => {
        const ativosUnicos = Array.from(
          new Set(dadosManutencoes.map((m) => m.ativoId))
        ).map((ativoId) => ({ id: ativoId, nome: `Ativo ${ativoId}` }));
        setAtivos(ativosUnicos);
        setLoading(false); 
      }, [dadosManutencoes]);
    
      const selectAtivos = CampoDropdown(
        "",
        ativos.map((ativo) => ativo.nome),
        "",
        "Selecione o ativo desejado",
        false
      );
    
  const selected = (value: string) => {
    setSelectedButton(value);
  };

  const calcularDadosParaGraficos = useCallback(() => {
    const dadosTempoTipo = calcularDadosTempoTipo(
      dadosManutencoes,
      selectedAtivo
    );
    const dadosEnviosTipo = calcularDadosEnviosTipo(
      dadosManutencoes,
      selectedAtivo
    );

    setChartData((prevChartData) => ({
      ...prevChartData,
      dadosTempoTipo,
      dadosEnviosTipo,
      loading: false, 
      error: null,    
    }));
  }, [dadosManutencoes, selectedAtivo]);

  useEffect(() => {
    const ativosUnicos = Array.from(
      new Set(dadosManutencoes.map((m) => m.ativoId))
    ).map((ativoId) => ({ id: ativoId, nome: `Ativo ${ativoId}` }));
    setAtivos(ativosUnicos);
  }, [dadosManutencoes, calcularDadosParaGraficos]);


  useEffect(() => {
    calcularDadosParaGraficos();
  }, [dadosManutencoes, selectedAtivo, calcularDadosParaGraficos]);  const calcularDadosTempoTipo = (
    dados: Manutencao[],
    ativoId?: number
  ): { tipo: string; tempo: number }[] => {
    const tempoPorTipo = dados
      .filter((m) => !ativoId || m.ativoId === ativoId)
      .reduce((acc, manutencao) => {
        const tipo = manutencao.tipo;
        const tempoEmDias = manutencao.dataFim
          ? Math.ceil(
              (new Date(manutencao.dataFim).getTime() -
                new Date(manutencao.dataInicio).getTime()) /
                (1000 * 3600 * 24)
            )
          : 0; 
  
        acc[tipo] = (acc[tipo] || 0) + tempoEmDias;
        return acc;
      }, {} as Record<string, number>);
  
    return Object.entries(tempoPorTipo).map(([tipo, tempo]) => ({ tipo, tempo }));
  };
  
  const calcularDadosEnviosTipo = (
    dados: Manutencao[],
    ativoId?: number
  ): { tipo: string; envios: number }[] => {
    const enviosPorTipo = dados
      .filter((m) => !ativoId || m.ativoId === ativoId)
      .reduce((acc, manutencao) => {
        const tipo = manutencao.tipo;
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
    return Object.entries(enviosPorTipo).map(([tipo, envios]) => ({ tipo, envios }));
  };
  

  return (
    <div className="relatorios-manutencoes">
      {dataInicial}
      {dataFinal}
      <div className="linha1Manutencoes">
      <div className="totalManutencoes">
          <p>TOTAL DE MANUTENÇÕES</p>
          <p className="valorCard">{totalManutencoes}</p>
        </div>
        <div className="valorTotalManutencoes">
          <p>VALOR TOTAL DAS MANUTENÇÕES</p>
          <p className="valorCard">
            R$
            {valorTotalManutencoes.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="btnsTipoManutencoes">
          <div className="linha1btns">
            <button
              className={
                selectedButton == "geral"
                  ? "btnManutencoes btnSelected"
                  : "btnManutencoes"
              }
              value={"geral"}
              onClick={() => selected("geral")}
            >
              Dados gerais
            </button>
            <button
              className={
                selectedButton == "preventiva"
                  ? "btnManutencoes btnSelected"
                  : "btnManutencoes"
              }
              value={"preventiva"}
              onClick={() => selected("preventiva")}
            >
              Preventiva
            </button>
          </div>
          <div className="linha2btns">
            <button
              className={
                selectedButton == "corretiva"
                  ? "btnManutencoes btnSelected"
                  : "btnManutencoes"
              }
              value={"corretiva"}
              onClick={() => selected("corretiva")}
            >
              Corretiva
            </button>
            <button
              className={
                selectedButton == "preditiva"
                  ? "btnManutencoes btnSelected"
                  : "btnManutencoes"
              }
              value={"preditiva"}
              onClick={() => selected("preditiva")}
            >
              Preditiva
            </button>
          </div>
        </div>
        {selectAtivos.codigo}
      </div>
      <div className="linha2Manutencoes">
        {!chartData.loading && !chartData.error && ( 
          <>
            <div className="tempoTipoManutencoes">
              <p>TEMPO x TIPO DE MANUTENÇÃO</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.dadosTempoTipo}>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="enviosTipoManutencao">
              <p>ENVIOS X TIPO DE MANUNTENÇÀO</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.dadosEnviosTipo}>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}