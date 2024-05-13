import React, { useEffect, useState } from "react";
import './css/visualizarHistorico.css'

interface EventoHistorico {
  id: number;
  ano: number;
  evento: string;
  data: string;
  descricao: string;
}

export default function VisualizarHistorico() {
  const [historico, setHistorico] = useState<EventoHistorico[]>([]);

  const dadosDoFetch: EventoHistorico[] = [
    {
      id: 1,
      ano: 2008,
      evento: "Philadelphia Museum School of Industrial Art",
      data: "2 de Fevereiro",
      descricao:
        "Attends the Philadelphia Museum School of Industrial Art. Studies design with Alexey Brodovitch, art director at Harper's Bazaar, and works as his assistant."
    },
    {
      id: 2,
      ano: 2009,
      evento: "University of Pennsylvania",
      data: "2 de Setembro",
      descricao:
        "Started from University of Pennsylvania. This is an important stage of my career. Here I worked in the local magazine. The experience greatly affected me."
    }
  ];

  useEffect(() => {
    setHistorico(dadosDoFetch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page" data-uia-timeline-skin="4" data-uia-timeline-adapter-skin-4="uia-card-skin-#1">
      <div className="uia-timeline">
        <div className="uia-timeline__container">
          <div className="uia-timeline__line"></div>
          <div className="uia-timeline__annual-sections">
            {historico.map((evento) => (
              <div key={evento.id} className="uia-timeline__groups">
                <section className="uia-timeline__group">
                  <div className="uia-timeline__point uia-card" data-uia-card-skin="1" data-uia-card-mod="1">
                    <div className="uia-card__container">
                      <div className="uia-card__intro">
                        <h3 className="ra-heading">{evento.evento}</h3>
                        <span className="uia-card__time">
                          <time dateTime={evento.ano.toString()}>
                            <span className="uia-card__day">{evento.data}</span>
                            <span>{evento.ano}</span>
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
  );
}
