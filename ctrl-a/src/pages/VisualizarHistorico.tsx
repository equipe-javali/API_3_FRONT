import React, { useEffect, useState } from "react";
import './css/visualizarHistorico.css';
import getLocalToken from "../utils/getLocalToken";
import { useParams } from "react-router-dom";
import { parseISO } from 'date-fns';

interface EventoHistorico {
  idAtivo: number;
  ultimaAtualizacaoAtivo?: string;
  dataCadastroAtivo?: string;
  nomeAtivo: string;
  nomeUsuario?: string;
  departamentoUsuario?: string;
  tipo?: string; // 'tangivel', 'intangivel', 'manutencao'
  custoAquisicaoAtivo?: number;
  garantiaAtivoTangivel?: string;
  taxaDepreciacaoAtivoTangivel?: number;
  periodoDepreciacaoAtivoTangivel?: string;
  dataExpiracaoAtivoIntangivel?: string;
  taxaAmortizacaoAtivoIntangivel?: number;
  periodoAmortizacaoAtivoIntangivel?: string;
  tipoManutencao?: string;
  descricaoManutencao?: string;
  custoManutencao?: number;
  dataFim?: string;
  dataAlteracao: string;  
  responsavel?: string;  
}

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export default function VisualizarHistorico() {
  const [nomeAtivo, setNomeAtivo] = useState<string>('');
  const [historico, setHistorico] = useState<EventoHistorico[]>([]);
  const token = getLocalToken();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchHistorico();
  }, [id]);

  async function fetchHistorico() {
    if (!id) return;

    try {
      const urls = [
        `http://localhost:8080/historicoAtivoTangivel/listagemAtivo/${id}`,
        `http://localhost:8080/historicoAtivoIntangivel/listagemAtivo/${id}`,
        `http://localhost:8080/manutencao/listagem/${id}`,        
      ];

      const responses = await Promise.all(urls.map(url => fetch(url, { headers: { Authorization: token } })));

      const historicoCompleto: EventoHistorico[] = [];
      for (const response of responses) {
        if (response.status === 200) {
          const data = await response.json();

          // Filtra os dados pelo idAtivo para cada tipo de evento
          const eventosFiltrados = data.filter((item: any) => item.idAtivo === Number(id) || (item.ativo && item.ativo.id === Number(id)));

          // Mapeia os dados filtrados para o formato EventoHistorico (simplificado)
          const eventosMapeados = eventosFiltrados.map((item: any) => {
            let tipo: string = 'manutencao'; // Define o tipo como manutenção por padrão

            if (item.nomeUsuario) { // Verifica se há nome de usuário
              tipo = "usuario";
            } else if (item.departamentoUsuario) {
              tipo = "local";
            }

            return {
              idAtivo: item.idAtivo || item.ativo.id,
              dataAlteracao: item.ultimaAtualizacaoAtivo || item.dataCadastroAtivo || item.dataInicio,
              nomeAtivo: item.nomeAtivo || item.ativo?.nome,
              nomeUsuario: item.nomeUsuario || "",
              departamentoUsuario: item.departamentoUsuario || "",
              tipo,
              tipoManutencao: item.tipo === 0 ? "Preventiva" : "Corretiva",
              descricaoManutencao: item.descricao,
              custoManutencao: item.custo,
              dataFim: item.dataFim,
              dataCadastro: item.dataCadastroAtivo,
            };
          });

          historicoCompleto.push(...eventosMapeados);
        } else {
          console.error(`Erro ao buscar histórico da URL ${response.url}: ${response.status}`);
        }
      }

      // Filtra o histórico completo pelo idAtivo
      const historicoFiltrado = historicoCompleto.filter(
        (e) => e.idAtivo === Number(id)
      );

      // Ordena o histórico filtrado por dataAlteracao (mais recente primeiro)
      historicoFiltrado.sort((a, b) => {
        return Date.parse(b.dataAlteracao) - Date.parse(a.dataAlteracao);
      });

      setHistorico(historicoFiltrado);
      setNomeAtivo(
        historicoFiltrado.length > 0
          ? historicoFiltrado[0].nomeAtivo
          : "Ativo sem histórico"
      );
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setHistorico([]);
      setNomeAtivo("Erro ao carregar histórico");
    }
  }

  return (
    <div className="VisualizarHistorico">
      <h1>Histórico do {nomeAtivo}</h1>
      <div className="Caixa_Historico">
        <div className="page" data-uia-timeline-skin="4" data-uia-timeline-adapter-skin-4="uia-card-skin-#1">
          <div className="uia-timeline">
            <div className="uia-timeline__container">
              <div className="uia-timeline__line"></div>
              <div className="uia-timeline__annual-sections">
                {historico.map((evento: EventoHistorico) => {
                  const dataAlteracao = isNaN(Date.parse(evento.dataAlteracao)) ? new Date() : parseISO(evento.dataAlteracao);

                  const dia = dataAlteracao.getDate();
                  const mes = meses[dataAlteracao.getMonth()];
                  const ano = dataAlteracao.getFullYear();

                  let tituloEvento = "";
                  let descricaoEvento = ""; // Detalhes da alteração do ativo (nome, custo, etc.)

                  if (evento.tipo === "manutencao") {
                    tituloEvento = evento.dataFim ? "Retorno da Manutenção" : "Envio para Manutenção"; // Diferencia envio e retorno
                    descricaoEvento = `${evento.tipoManutencao} - ${evento.descricaoManutencao} (Custo: ${evento.custoManutencao})`;
                  } else if (evento.tipo === "usuario") { // Mostra a troca de usuário
                    tituloEvento = "Troca de Usuário";
                    descricaoEvento = `${evento.nomeUsuario} (${evento.departamentoUsuario})`; 
                  } else if (evento.tipo === "local") {
                    tituloEvento = "Troca de Departamento"; // Ou "Troca de Local", dependendo da sua preferência
                    descricaoEvento = `Novo departamento: ${evento.departamentoUsuario}`;
                  } else if (evento.dataCadastroAtivo) {
                    tituloEvento = "Cadastro do Ativo";
                    descricaoEvento = "";
                  }

                  return (
                    <div key={`${evento.tipo}-${evento.dataAlteracao}`} className="uia-timeline__groups">
                      <span className="uia-timeline__year" aria-hidden="true">{ano}</span>
                      <section className="uia-timeline__group">
                        <div className="uia-timeline__point uia-card" data-uia-card-skin="1" data-uia-card-mod="1">
                          <div className="uia-card__container">
                            <div className="uia-card__intro">
                              <h3 className="ra-heading">{tituloEvento}</h3>
                              <span className="uia-card__time">
                                <time dateTime={evento.dataAlteracao}>
                                  <span className="uia-card__day">{dia}</span>
                                  <span> {mes}</span>
                                </time>
                              </span>
                            </div>
                            <div className="uia-card__body">
                              <div className="uia-card__description">
                                <p>{descricaoEvento}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}