import React, { useState, useEffect } from 'react';
import RelatorioManutencoes from '../pages/relatorioManutencoes';
import getLocalToken from '../utils/getLocalToken';

interface Manutencao {
  id: number;
  tipo: string;
  custo: number;
  dataInicio: string;
  dataFim: string | null;
  ativoId: number;
}

interface DadosManutencaoProps {
  dataInicial: string;
  dataFinal: string;
}

function DadosManutencao({ dataInicial, dataFinal }: DadosManutencaoProps) {
  const [dadosManutencoes, setDadosManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCharts, setShowCharts] = useState(false);
  const [selectedButton, setSelectedButton] = useState("geral");
  const selected = (value: string) => {
    setSelectedButton(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getLocalToken();
      console.log("Token:", token); 

      if (!token) {
        setError("Token de autenticação não encontrado.");
        setLoading(false);
        return;
      }

      try {
        const url = `http://localhost:8080/manutencao/listagemTodos?dataInicial=${dataInicial}&dataFinal=${dataFinal}&tipo=${selectedButton}`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token,
          },
          mode: "cors",
        });

        console.log("Resposta da API:", response);

        if (!response.ok) {
            throw new Error(
              `Erro na resposta da API: ${response.status} ${response.statusText}`
            );
          }    
          
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("O corpo da resposta da API é inválido.");
          }
    
          let dadosString = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
    
            dadosString += new TextDecoder().decode(value);
          }
    
          const data: Manutencao[] = JSON.parse(dadosString);
          console.log("Dados Recebidos:", data);
        console.log("Dados Recebidos:", data);
        const dadosFiltrados = data.filter(manutencao => {
            const dataInicioManutencao = new Date(manutencao.dataInicio);
            const dataFinalManutencao = manutencao.dataFim ? new Date(manutencao.dataFim) : new Date(); // Se dataFim for nulo, use a data atual
            return (
              dataInicioManutencao >= new Date(dataInicial) && 
              (dataFinalManutencao <= new Date(dataFinal) || dataFinal === '') // Permitir manutenções em aberto se a data final não for especificada
            );
          });

        setDadosManutencoes(dadosFiltrados);
    setShowCharts(true);  
} catch (error) {
    console.error("Erro ao buscar dados:", error);
    setError("Erro ao buscar dados de manutenção.");
    setLoading(false); 
  }
};

fetchData();
}, [dataInicial, dataFinal]);

  return (
    <>
      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <RelatorioManutencoes
          dataInicial={dataInicial}
          dataFinal={dataFinal}
          dadosManutencoes={dadosManutencoes}
        />
      )}
    </>
  );
}

export default DadosManutencao;
