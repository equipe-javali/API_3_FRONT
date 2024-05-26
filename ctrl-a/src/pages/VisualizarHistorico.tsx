import React, { useEffect, useState } from "react";
import './css/visualizarHistorico.css';
import getLocalToken from "../utils/getLocalToken";
import { useParams } from "react-router-dom";

interface Evento {
  tipo: 'alteracao' | 'manutencao';
  data: string;
  dataFim?: string; // Opcional para manutenções
  nomeAtivo: string;
  nomeUsuario?: string;
  departamentoUsuario?: string;
  tipoManutencao?: string;
  descricaoManutencao?: string;
  custoManutencao?: string;
}

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export default function VisualizarHistorico() {
  const [nomeAtivo, setNomeAtivo] = useState<string>('');
  const [historico, setHistorico] = useState<Evento[]>([]);
  const token = getLocalToken();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const urls = [
          `http://localhost:8080/historicoAtivoIntangivel/listagemAtivo/${id}`,
          `http://localhost:8080/historicoAtivoTangivel/listagemAtivo/${id}`,
          `http://localhost:8080/manutencao/listagem/${id}`,
        ];

        const [alteracoesIntangiveis, alteracoesTangiveis, manutencoes] = await Promise.all(
          urls.map(url => fetch(url, { headers: { Authorization: token } }))
        );

        const historicoCompleto: Evento[] = [];

        // Alterações de ativos intangíveis
        if (alteracoesIntangiveis.status === 200) {
          const data = await alteracoesIntangiveis.json();
          historicoCompleto.push(
            ...data.map((item: any) => ({
              tipo: 'alteracao',
              data: item.ultimaAtualizacaoAtivo,
              nomeAtivo: item.nomeAtivo,
              nomeUsuario: item.nomeUsuario,
              departamentoUsuario: item.departamentoUsuario,
            }))
          );
        }

        // Alterações de ativos tangíveis
        if (alteracoesTangiveis.status === 200) {
          const data = await alteracoesTangiveis.json();
          historicoCompleto.push(
            ...data.map((item: any) => ({
              tipo: 'alteracao',
              data: (item.ultimaAtualizacaoAtivo !== null ? item.ultimaAtualizacaoAtivo : item.dataCadastroAtivo),
              nomeAtivo: item.nomeAtivo,
              nomeUsuario: item.nomeUsuario,
              departamentoUsuario: item.departamentoUsuario,
            }))
          );
        }


        // Manutenções

        if (manutencoes.status === 200) {
          const data = await manutencoes.json();
          historicoCompleto.push(
            ...data.map((item: any) => ({
              tipo: 'manutencao',
              data: item.dataInicio,
              dataFim: item.dataFim, // Incluindo dataFim
              nomeAtivo: item.nomeAtivo,
              tipoManutencao: item.tipo,
              descricaoManutencao: item.descricao,
              custoManutencao: item.custo,
            }))
          );
        }



        historicoCompleto.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        setHistorico(historicoCompleto);
        setNomeAtivo(historicoCompleto.length > 0 ? historicoCompleto[0].nomeAtivo : "Ativo não encontrado");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setHistorico([]);
        setNomeAtivo("Erro ao carregar histórico");
      }
    };

    if (id) {
      fetchHistorico();

    }
  }, [id, token]);

  return (
    <div className="VisualizarHistorico">
      <h1>Histórico do {nomeAtivo}</h1>
      <div className="Caixa_Historico">
        <div className="page" data-uia-timeline-skin="4" data-uia-timeline-adapter-skin-4="uia-card-skin-#1">
          <div className="uia-timeline">
            <div className="uia-timeline__container">
              <div className="uia-timeline__line"></div>
              <div className="uia-timeline__annual-sections">
                {historico.map((evento) => {
                  console.log(evento);

                  const data = new Date(Number(evento.data.substring(0, 4)).valueOf(),
                    Number(evento.data.substring(5, 7)).valueOf(), Number(evento.data.substring(8, 10)).valueOf());
                  const dia = data.getDate();
                  const mes = meses[data.getMonth()];
                  const ano = data.getFullYear();

                  return (
                    <div key={`${evento.tipo}-${evento.data}`} className="uia-timeline__groups">
                      <span className="uia-timeline__year" aria-hidden="true">{ano}</span>
                      <section className="uia-timeline__group">
                        <div className="uia-timeline__point uia-card" data-uia-card-skin="1" data-uia-card-mod="1">
                          <div className="uia-card__container">
                            <div className="uia-card__intro">
                              <h3 className="ra-heading">
                                {evento.tipo === "manutencao"
                                  ? `Manutenção ${evento.dataFim ? '(Retorno)' : '(Envio)'}: ${evento.tipoManutencao} - ${evento.descricaoManutencao} (Custo: ${evento.custoManutencao})`
                                  : (evento.nomeUsuario !== null ? `${evento.nomeUsuario} (${evento.departamentoUsuario})` : `Ativo sem usuário`)}
                              </h3>
                              <span className="uia-card__time">
                                <time dateTime={evento.data}>
                                  <span className="uia-card__day">{dia}</span>
                                  <span> {mes}</span>
                                </time>
                              </span>
                            </div>
                            <div className="uia-card__body">
                              <div className="uia-card__description">
                                <p>{evento.nomeAtivo}</p>
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
