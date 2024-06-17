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
  tipoManutencao?: string;
  descricaoManutencao?: string;
  custoManutencao?: number;
  localizacao?: string;
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
    async function fetchHistorico() {
      if (!id) return;

      try {
        const urls = [
          `http://localhost:8080/historicoAtivoTangivel/listagemAtivo/${id}`,
          `http://localhost:8080/historicoAtivoIntangivel/listagemAtivo/${id}`,
          `http://localhost:8080/manutencao/listagem/${id}`,
        ];

        const responses = await Promise.all(
          urls.map(
            async (url) => await fetch(url, { headers: { Authorization: token } })
          )
        );

        let historicoCompleto: EventoHistorico[] = [];
        for (const response of responses) {
          if (!response.ok) {
            console.log("Resposta vazia do servidor");
            continue;
          }

          const data = await response.text();
          if (!data) {
            console.error(
              `Erro ao buscar histórico da URL ${response.url}: ${response.status}`
            );
            continue;
          }

          const jsonData = JSON.parse(data).sort((a: any, b: any) => {
            if (!a.id) a.id = Number.MAX_SAFE_INTEGER;
            if (!b.id) b.id = Number.MAX_SAFE_INTEGER;
            return a.id - b.id;
          });
          console.log(jsonData);
          for (let i = 0; i < jsonData.length; i++) {
            const item = jsonData[i];

            let tipo = "NENHUM";

            let nomeUsuarioAnterior = "Sem responsável";
            if (item.nomeUsuario) {
              if (i > 0 && jsonData[i - 1].nomeUsuario !== item.nomeUsuario) {
                nomeUsuarioAnterior =
                  jsonData[i - 1].nomeUsuario || "Sem responsável";
                tipo = "usuario";
              }
            } else if (item.ultimaAtualizacaoAtivo === null) {
              tipo = "cadastro";
            } else if (item.responsavel) {
              tipo = "responsavel";
            } else if (item.dataFim && new Date(item.dataFim) <= new Date()) {
              historicoCompleto.push({
                id: item.id,
                idAtivo: item.idAtivo || item.ativo.id,
                dataAlteracao:
                  item.dataInicio ||
                  item.ultimaAtualizacaoAtivo ||
                  item.dataCadastroAtivo,
                nomeAtivo: item.nomeAtivo || item.ativo?.nome,
                nomeUsuario: item.nomeUsuario || "",
                nomeUsuarioAnterior,
                departamentoUsuario: item.departamentoUsuario || "",
                tipo: "envioManutencao",
                tipoManutencao: item.tipo === 0 ? "Preventiva" : "Corretiva",
                descricaoManutencao: item.descricao,
                custoManutencao: item.custo,
                dataCadastroAtivo: item.dataCadastroAtivo,
              });

              tipo = "retornoManutencao";
            } else if (item.dataInicio) {
              tipo = "envioManutencao";
            } else {
              continue;
            }

            historicoCompleto.push({
              id: item.id,
              idAtivo: item.idAtivo || item.ativo.id,
              dataAlteracao:
                (tipo === "retornoManutencao" ? item.dataFim : item.dataInicio) ||
                item.ultimaAtualizacaoAtivo ||
                item.dataCadastroAtivo,
              nomeAtivo: item.nomeAtivo || item.ativo?.nome,
              nomeUsuario: item.nomeUsuario || "",
              nomeUsuarioAnterior,
              departamentoUsuario: item.departamentoUsuario || "",
              tipo,
              tipoManutencao: item.tipo === 0 ? "Preventiva" : "Corretiva",
              descricaoManutencao: item.descricao,
              custoManutencao: item.custo,
              dataCadastroAtivo: item.dataCadastroAtivo,
            });
          }

          const historicoFiltrado = historicoCompleto
            .filter((e) => e.idAtivo === Number(id) || e.dataCadastroAtivo)
            .sort((a, b) => {
              const dateComparison = b.dataAlteracao.localeCompare(
                a.dataAlteracao
              );
              if (dateComparison !== 0) {
                return dateComparison;
              }

              if (
                a.tipo === "envioManutencao" &&
                b.tipo === "retornoManutencao" &&
                a.tipoManutencao === b.tipoManutencao
              ) {
                return 1;
              } else if (
                a.tipo === "retornoManutencao" &&
                b.tipo === "envioManutencao" &&
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
        }
      } catch (error) {
        console.error("Erro ao carregar históricos:", error);
        setHistorico([]);
      }
    }
    fetchHistorico();
  }, [id, token]);

  return (
    <div className="VisualizarHistorico">
      <h2>Histórico do {nomeAtivo}</h2>
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
                  historico.map((evento: EventoHistorico, index) => {
                    const dataAlteracao = parseISO(evento.dataAlteracao);
                    const dia = dataAlteracao.getDate();
                    const mes = meses[dataAlteracao.getMonth()];
                    const ano = dataAlteracao.getFullYear();

                    let tituloEvento = "";
                    let descricaoEvento: React.ReactNode = "";

                    if (evento.tipo === "envioManutencao") {
                      tituloEvento = "Envio para Manutenção";
                      descricaoEvento = (
                        <div>
                          <p>
                            {evento.tipoManutencao} -{" "}
                            {evento.descricaoManutencao}
                          </p>
                          {evento.custoManutencao && (
                            <p>Custo: R$ {evento.custoManutencao.toFixed(2)}</p>
                          )}
                          {evento.localizacao && (
                            <p>Local: {evento.localizacao}</p>
                          )}
                        </div>
                      );
                    } else if (evento.tipo === "retornoManutencao") {
                      tituloEvento = "Retorno da Manutenção";
                      descricaoEvento = (
                        <div>
                          <p>
                            {evento.tipoManutencao} -{" "}
                            {evento.descricaoManutencao}
                          </p>
                          {evento.custoManutencao && (
                            <p>Custo: R$ {evento.custoManutencao.toFixed(2)}</p>
                          )}
                          {evento.localizacao && (
                            <p>Local: {evento.localizacao}</p>
                          )}
                        </div>
                      );
                    } else if (evento.tipo === "usuario") {
                      tituloEvento = "Troca de Responsável";
                      descricaoEvento = (
                        <div>
                          <p>
                            Responsável: {evento.nomeUsuario} (
                            {evento.departamentoUsuario})
                          </p>
                          <p>
                            Responsável anterior: {evento.nomeUsuarioAnterior}{" "}
                            {evento.departamentoUsuarioAnterior
                              ? `(${evento.departamentoUsuarioAnterior})`
                              : ""}
                          </p>
                        </div>
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
                                    {index === 0 ? (
                                      <span className="uia-card__day">
                                        Atual
                                      </span>
                                    ) : (
                                      <>
                                        <span className="uia-card__day">
                                          {dia}
                                        </span>
                                        <span>{mes}</span>
                                      </>
                                    )}
                                    {/* <span className="uia-card__day">{dia}</span>
                                    <span>{mes}</span> */}
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
