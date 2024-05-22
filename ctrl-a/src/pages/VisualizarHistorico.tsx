import React, { useEffect, useState } from "react";
import './css/visualizarHistorico.css';
import getLocalToken from "../utils/getLocalToken";
import { useParams } from "react-router-dom";

interface EventoHistorico {
  idAtivo: number,
  dataAlteracao: string,
  nomeAtivo: string,
  nomeUsuario: string,
  departamentoUsuario: string
}

interface DadosAtivo {
  nome: string;
  historico: EventoHistorico[];
}

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export default function VisualizarHistorico() {
  const [nomeAtivo, setNomeAtivo] = useState<string>('');
  const [historico, setHistorico] = useState<EventoHistorico[] | any>([]);
  const token = getLocalToken();
  const { id } = useParams();

  useEffect(() => {
    fetchHistorico();
  }, []);

  async function fetchHistorico() {
    try {
      const response = await fetch('http://localhost:8080/historicoAtivoTangivel/listagemTodos', {
        headers: {
          "Authorization": token
        }
      });
      
      if (response.ok) {
        const data: EventoHistorico[] = await response.json();
        const historicoFiltrado = data.filter(e => Number(e?.idAtivo) === Number(id))


        if (historicoFiltrado.length > 0) {
          setHistorico(historicoFiltrado);
          setNomeAtivo(historicoFiltrado[0].nomeAtivo);
          console.log('historico FILTRADO: ', historicoFiltrado)
          console.log('historico: ', historico)
        } else {
          console.log('Caiu pra fora');
          }
      } else {
        throw new Error('Erro na solicitação fetch');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  return (
    <div className="VisualizarHistorico">
      <h1> Histórico do {nomeAtivo}</h1>
      <div className="Caixa_Historico">
        <div className="page" data-uia-timeline-skin="4" data-uia-timeline-adapter-skin-4="uia-card-skin-#1">
          <div className="uia-timeline">
            <div className="uia-timeline__container">
              <div className="uia-timeline__line"></div>
              <div className="uia-timeline__annual-sections">
                {/* {historico.slice().map((evento) => (
                  <div key={evento.id} className="uia-timeline__groups">
                    <span className="uia-timeline__year" aria-hidden="true">{evento.ano}</span>
                    <section className="uia-timeline__group">
                      <div className="uia-timeline__point uia-card" data-uia-card-skin="1" data-uia-card-mod="1">
                        <div className="uia-card__container">
                          <div className="uia-card__intro">
                            <h3 className="ra-heading">{evento.evento}</h3>
                            <span className="uia-card__time">
                              <time dateTime={evento.ano.toString()}>
                                <span className="uia-card__day">{evento.data.split(" ")[0]}</span>{" "}
                                <span>{evento.data.split(" ")[1]}</span>
                              </time>
                            </span>
                          </div>
                          <div className="uia-card__body">
                            <div className="uia-card__description">
                              <p>{evento.descricao}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
