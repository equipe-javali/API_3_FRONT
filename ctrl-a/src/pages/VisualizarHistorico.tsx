import React, { useEffect, useState } from "react";
import "./css/visualizarHistorico.css";
import getLocalToken from "../utils/getLocalToken";
import { useParams } from "react-router-dom";
import { parseISO, format } from "date-fns";

interface EventoHistorico {
  id?: number;
  idAtivo: number;
  ultimaAtualizacaoAtivo?: string;
  dataCadastroAtivo?: string;
  nomeAtivo: string;
  nomeUsuario?: string;
  departamentoUsuario?: string;
  departamentoUsuarioAnterior?: string;
  tipo?: string;
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
  nomeUsuarioAnterior?: string;
}

const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function VisualizarHistorico() {
  const [nomeAtivo, setNomeAtivo] = useState<string>("Carregando histórico...");
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

      const responses = await Promise.all(
        urls.map((url) => fetch(url, { headers: { Authorization: token } }))
      );

      const historicoCompleto: EventoHistorico[] = [];
      for (const response of responses) {
        if (response.ok) {
          const data = await response.text();

          if (data) {
            const jsonData = JSON.parse(data);

            const eventosFiltrados = jsonData.filter(
              (item: any) =>
                item.idAtivo === Number(id) ||
                (item.ativo && item.ativo.id === Number(id))
            );

            let nomeUsuarios: string[] = [];
            let nomeUsuarioAnterior = "";
            let departamentosUsuarios: string[] = [];
            let departamentoUsuarioAnterior = "";

            const eventosMapeados: any[] = [];

            eventosFiltrados.forEach((item: any) => {
              let tipo: string = "manutencao";

              if (item.nomeUsuario) {
                tipo = "usuario";
                if (
                  nomeUsuarios[nomeUsuarios.length - 1] !== item.nomeUsuario
                ) {
                  nomeUsuarios.push(item.nomeUsuario);
                  departamentosUsuarios.push(item.departamentoUsuario || "");
                }
                nomeUsuarioAnterior =
                  nomeUsuarios[nomeUsuarios.length - 2] || "";
                departamentoUsuarioAnterior =
                  departamentosUsuarios[departamentosUsuarios.length - 2] || "";
              } else if (item.departamentoUsuario) {
                tipo = "local";
              } else if (item.dataCadastroAtivo) {
                tipo = "cadastro";
              } else if (item.responsavel) {
                tipo = "responsavel";
              }

              eventosMapeados.push({
                id: item.id,
                idAtivo: item.idAtivo || item.ativo.id,
                dataAlteracao:
                  item.ultimaAtualizacaoAtivo ||
                  item.dataCadastroAtivo ||
                  item.dataInicio,
                nomeAtivo: item.nomeAtivo || item.ativo?.nome,
                nomeUsuario: item.nomeUsuario || "",
                nomeUsuarioAnterior,
                departamentoUsuarioAnterior,
                departamentoUsuario: item.departamentoUsuario || "",
                tipo,
                tipoManutencao: item.tipo === 0 ? "Preventiva" : "Corretiva",
                descricaoManutencao: item.descricao,
                custoManutencao: item.custo,
                dataCadastroAtivo: item.dataCadastroAtivo,
                localManutencao: item.localManutencao,
              });

              if (item.dataFim && tipo === "manutencao") {
                eventosMapeados.push({
                  id: item.id,
                  idAtivo: item.idAtivo || item.ativo.id,
                  dataAlteracao:
                    item.ultimaAtualizacaoAtivo ||
                    item.dataCadastroAtivo ||
                    item.dataFim,
                  nomeAtivo: item.nomeAtivo || item.ativo?.nome,
                  nomeUsuario: item.nomeUsuario || "",
                  nomeUsuarioAnterior,
                  departamentoUsuario: item.departamentoUsuario || "",
                  tipo: "retornoManutencao",
                  tipoManutencao: item.tipo === 0 ? "Preventiva" : "Corretiva",
                  descricaoManutencao: item.descricao,
                  custoManutencao: item.custo,
                  dataFim: item.dataFim,
                  dataCadastroAtivo: item.dataCadastroAtivo,
                  localManutencao: item.localManutencao,
                });
              }
            });

            historicoCompleto.push(...eventosMapeados);
          } else {
            console.log("Resposta vazia do servidor");
          }
        } else {
          console.error(
            `Erro ao buscar histórico da URL ${response.url}: ${response.status}`
          );
          setNomeAtivo("Ativo não encontrado");
        }
      }

      const historicoFiltrado = historicoCompleto
        .filter((e) => e.idAtivo === Number(id) || e.dataCadastroAtivo)
        .sort((a, b) => {
          const dateComparison = b.dataAlteracao.localeCompare(a.dataAlteracao);
          if (dateComparison !== 0) {
            return dateComparison;
          }

          if (
            a.tipo === "manutencao" &&
            b.tipo === "retornoManutencao" &&
            a.tipoManutencao === b.tipoManutencao
          ) {
            return 1;
          } else if (
            a.tipo === "retornoManutencao" &&
            b.tipo === "manutencao" &&
            a.tipoManutencao === b.tipoManutencao
          ) {
            return 0;
          }

          return (b.id ? b.id : 0) - (a.id ? a.id : 0);
        });

      if (historicoFiltrado.length > 0) {
        setHistorico(historicoFiltrado);
        setNomeAtivo(historicoFiltrado[0].nomeAtivo);
      } else {
        const eventoCadastro = {
          idAtivo: Number(id),
          dataAlteracao: new Date().toISOString(),
          nomeAtivo: "Ativo sem histórico",
          tipo: "cadastro",
        };
        setHistorico([eventoCadastro]);
        setNomeAtivo(eventoCadastro.nomeAtivo);
      }
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
        <div
          className="page"
          data-uia-timeline-skin="4"
          data-uia-timeline-adapter-skin-4="uia-card-skin-#1"
        >
          <div className="uia-timeline">
            <div className="uia-timeline__container">
              <div className="uia-timeline__line"></div>
              <div className="uia-timeline__annual-sections">
                {historico.length > 0 ? (
                  historico.map((evento: EventoHistorico) => {
                    const dataAlteracao = parseISO(evento.dataAlteracao);
                    const dataCadastro = evento.dataCadastroAtivo
                      ? parseISO(evento.dataCadastroAtivo)
                      : null;

                    const dia = dataAlteracao.getDate();
                    const mes = meses[dataAlteracao.getMonth()];
                    const ano = dataAlteracao.getFullYear();

                    let tituloEvento = "";
                    let descricaoEvento: React.ReactNode = "";

                    if (evento.tipo === "manutencao") {
                      tituloEvento = "Envio para Manutenção";
                      descricaoEvento = `${evento.tipoManutencao} - ${evento.descricaoManutencao} (Custo: ${evento.custoManutencao})`;
                    } else if (evento.tipo === "retornoManutencao") {
                      tituloEvento = "Retorno da Manutenção";
                      descricaoEvento = `${evento.tipoManutencao} - ${evento.descricaoManutencao} (Custo: ${evento.custoManutencao})`;
                    } else if (evento.tipo === "usuario") {
                      tituloEvento = "Troca de Responsável";
                      descricaoEvento = (
                        <ul>
                          <li>
                            Responsável: {evento.nomeUsuario} (
                            {evento.departamentoUsuario})
                          </li>
                          <li>
                            Responsável anterior: {evento.nomeUsuarioAnterior} (
                            {evento.departamentoUsuarioAnterior})
                          </li>
                        </ul>
                      );
                    } else if (evento.tipo === "local") {
                      tituloEvento = "Troca de Departamento";
                      descricaoEvento = `Novo departamento: ${evento.departamentoUsuario}`;
                    } else if (
                      evento.dataCadastroAtivo ||
                      (historico.length === 0 && evento.tipo === "cadastro")
                    ) {
                      tituloEvento = "Cadastro do Ativo";
                    }

                    return (
                      <div
                        key={`${evento.tipo}-${evento.dataAlteracao}`}
                        className="uia-timeline__groups"
                      >
                        <span className="uia-timeline__year" aria-hidden="true">
                          {ano}
                        </span>
                        <section className="uia-timeline__group">
                          <div
                            className="uia-timeline__point uia-card"
                            data-uia-card-skin="1"
                            data-uia-card-mod="1"
                          >
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
                  })
                ) : (
                  <div className="uia-timeline__event">
                    <div className="uia-timeline__event__date">
                      {historico[0] && historico[0].dataCadastroAtivo
                        ? format(
                            parseISO(historico[0].dataCadastroAtivo),
                            "dd/MM/yyyy"
                          )
                        : ""}
                    </div>
                    <div className="uia-timeline__event__content">
                      <h2>Cadastro do Ativo</h2>
                      <p>
                        O ativo foi cadastrado mas ainda não possui eventos.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
