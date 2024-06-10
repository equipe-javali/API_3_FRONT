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

  useEffect(() => {
    const fetchData = async () => {
      const token = getLocalToken();

      if (!token) {
        setError('Token de autenticação não encontrado.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/manutencao/listagemTodos', {
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

        const data: Manutencao[] = await response.json();
        const dadosFiltrados = data.filter((manutencao) => {
          const dataInicioManutencao = new Date(manutencao.dataInicio);
          return (
            dataInicioManutencao >= new Date(dataInicial) &&
            dataInicioManutencao <= new Date(dataFinal)
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
