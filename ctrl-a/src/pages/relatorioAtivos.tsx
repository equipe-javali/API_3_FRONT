import { useState, useEffect } from "react";
import "./css/relatorioAtivos.css";
import getLocalToken from "../utils/getLocalToken";

interface Ativo {
  id: number;
  nome: string;
  tipo: "tangível" | "intangível";
  valor: number;
  local: string;
  status: "ativo" | "em uso" | "manutenção";
}
export default function RelatorioAtivos({
  dataInicial,
  dataFinal,
}: {
  dataInicial: string;
  dataFinal: string;
}) {
  const [selectedButton, setSelectedButton] = useState("geral");
  const [dadosAtivos, setDadosAtivos] = useState<Ativo[]>([]);
  const token = getLocalToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/ativo/listagemTodos?dataicial=${dataInicial}&dataFinal=${dataFinal}&tipo=${selectedButton}`
          , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": token
            },
            mode: 'cors'
        })

        if (!response.ok) {
          throw new Error(
            `Erro na resposta da API: ${response.status} ${response.statusText}`
          );
        }

        const data: Ativo[] = await response.json();
        setDadosAtivos(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setDadosAtivos([]);
      }
    };

    fetchData();
  }, [dataInicial, dataFinal, selectedButton]);

  const totalAtivos = dadosAtivos.length;
  const valorTotalAtivos = dadosAtivos.reduce((acc, ativo) => acc + ativo.valor, 0);

  const dadosStatus: Record<string, number> = dadosAtivos.reduce(
    (acc: Record<string, number>, ativo) => {
      const status = ativo.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  const dadosLocal: Record<string, number> = dadosAtivos.reduce(
    (acc: Record<string, number>, ativo) => {
      acc[ativo.local] = (acc[ativo.local] || 0) + 1;
      return acc;
    },
    {}
  );
  const selected = (button: string) => {
    setSelectedButton(button);
  };

  return (
    <div className="relatorios-ativos">
      {dataInicial}
      {dataFinal}
      <div className="linha1Ativos">
        <div className="totalAtivos">
          <p>TOTAL DE ATIVOS</p>
          <p className="valorCard">{totalAtivos}</p>
        </div>
        <div className="valorTotalAtivos">
          <p>VALOR TOTAL DE ATIVOS</p>
          <p className="valorCard">
            R$
            {valorTotalAtivos.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="btnsTiposAtivos">
          <button
            className={
              selectedButton == "geral" ? "btnAtivos btnSelected" : "btnAtivos"
            }
            value={"geral"}
            onClick={() => selected("geral")}
          >
            Dados gerais
          </button>
          <button
            className={
              selectedButton == "tangiveis"
                ? "btnAtivos btnSelected"
                : "btnAtivos"
            }
            value={"tangiveis"}
            onClick={() => selected("tangiveis")}
          >
            Tangíveis
          </button>
          <button
            className={
              selectedButton == "intangiveis"
                ? "btnAtivos btnSelected"
                : "btnAtivos"
            }
            value={"intangivel"}
            onClick={() => selected("intangiveis")}
          >
            Intangíveis
          </button>
        </div>
      </div>
      <div className="linha2Ativos">
        <div className="statusAtivos">
          <p>STATUS DOS ATIVOS</p>
          <div className="graficoAtivos"></div>
        </div>
        <div className="qntdLocalAtivos">
          <p>QUANTIDADE DE ATIVOS X LOCAL</p>
          <div className="graficoAtivos"></div>
        </div>
      </div>
    </div>
  );
}
