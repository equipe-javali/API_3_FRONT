import React, { useEffect, useState } from "react";
import './css/visualizarHistorico.css';

interface EventoHistorico {
  id: number;
  ano: number;
  evento: string;
  data: string;
  descricao: string;
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
  const [historico, setHistorico] = useState<EventoHistorico[]>([]);

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const response = await fetch('http://localhost:8080/visualizarhistorico/${id_ativo}');
        if (!response.ok) {
          throw new Error('Erro ao carregar dados');
        }
        const dadosAtivo: DadosAtivo = await response.json();
        setNomeAtivo(dadosAtivo.nome);
        const historicoOrdenado = dadosAtivo.historico.sort((a: EventoHistorico, b: EventoHistorico) => {
          if (a.ano !== b.ano) {
            return b.ano - a.ano;
          }

          const [diaA, mesA] = a.data.split(" ");
          const [diaB, mesB] = b.data.split(" ");
          
          const indexMesA = meses.indexOf(mesA);
          const indexMesB = meses.indexOf(mesB);
          if (indexMesA !== indexMesB) {
            return indexMesB - indexMesA; 
          }

          if (parseInt(diaA) !== parseInt(diaB)) {
            return parseInt(diaB) - parseInt(diaA); 
          }

          return 0;
        });
        setHistorico(historicoOrdenado);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }    

    fetchHistorico();
  }, []);

  return (
    <div className="VisualizarHistorico">
      <h1> Histórico do {nomeAtivo}</h1>
      <div className="Caixa_Historico">
        <div className="page" data-uia-timeline-skin="4" data-uia-timeline-adapter-skin-4="uia-card-skin-#1">
          <div className="uia-timeline">
            <div className="uia-timeline__container">
              <div className="uia-timeline__line"></div>
              <div className="uia-timeline__annual-sections">
                {historico.slice().map((evento) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
