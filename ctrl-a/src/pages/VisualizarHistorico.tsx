import React, { useEffect, useState } from "react";
import './css/visualizarHistorico.css';
import getLocalToken from "../utils/getLocalToken";
import { useParams } from "react-router-dom";

interface EventoHistorico {
  idAtivo: number;
  idAtivoTangivel?: number;
  idAtivoIntangivel?: number;
  dataAlteracao: string;
  nomeAtivo: string;
  nomeUsuario: string;
  departamentoUsuario: string;
}

const meses = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export default function VisualizarHistorico() {
  const [nomeAtivo, setNomeAtivo] = useState<string>('');
  const [historico, setHistorico] = useState<EventoHistorico[]>([]);
  const token = getLocalToken();
  const { id } = useParams();

  useEffect(() => {
    fetchHistorico();
  }, []);

  async function fetchHistorico() {
    try {
      let tangivel = await fetch('http://localhost:8080/historicoAtivoTangivel/listagemTodos', {
        headers: {
          "Authorization": token
        }
      });
      const data: EventoHistorico[] = await tangivel.json();
      const historicoFiltrado = data.filter(e => Number(e?.idAtivo) === Number(id))

      const historicoOrdenado = historicoFiltrado.sort((a: EventoHistorico, b: EventoHistorico) => {
        const [anoA, mesA, diaA] = a.dataAlteracao.split("-");
        const [anoB, mesB, diaB] = b.dataAlteracao.split("-");
      
        // Função para obter o nome abreviado do mês
        function getNomeMes(numeroMes: number): string {
          return meses[numeroMes - 1];
        }
      
        // Comparação de ano
        if (parseInt(anoA) !== parseInt(anoB)) {
          return parseInt(anoB) - parseInt(anoA);
        }
      
        // Comparação de mês
        const nomeMesA = getNomeMes(parseInt(mesA));
        const nomeMesB = getNomeMes(parseInt(mesB));
        if (nomeMesA !== nomeMesB) {
          return meses.indexOf(nomeMesB) - meses.indexOf(nomeMesA);
        }
      
        // Comparação de dia
        return parseInt(diaB) - parseInt(diaA);
      });
      
      

      if (tangivel.ok) {
        if (historicoFiltrado.length > 0) {
          if (historicoFiltrado[0].idAtivoTangivel) {
            setHistorico(historicoFiltrado);
            setNomeAtivo(historicoFiltrado[0].nomeAtivo);
            console.log('historico FILTRADO: ', historicoFiltrado)

          } else if (historicoFiltrado[0].idAtivoIntangivel) {
            const intangivel = await fetch('http://localhost:8080/historicoAtivoIntangivel/listagemTodos', {
              headers: {
                "Authorization": token
              }
            })
            if (intangivel.ok) {
              const dataIntangivel: EventoHistorico[] = await intangivel.json()
              const historicoIntangivel = dataIntangivel.filter(e => Number(e?.idAtivo) === Number(id))

              console.log('Caiu pra fora do tangivel')
              try {
                setHistorico(historicoIntangivel);
                setNomeAtivo(historicoIntangivel[0].nomeAtivo)
                console.log('historico: ', historicoIntangivel)
              } catch(error){
                setHistorico([]);
                console.log('historico: ', historicoIntangivel)
                console.log('num tem aqui não >:(')
              }
            }
          } else {
            console.log('status n ok')
          }
          
        } else {
          const intangivel = await fetch('http://localhost:8080/historicoAtivoIntangivel/listagemTodos', {
            headers: {
              "Authorization": token
            }
          })
          console.log('entrou')

          if (intangivel.ok) {
            const dataIntangivel: EventoHistorico[] = await intangivel.json()
            const historicoIntangivel = dataIntangivel.filter(e => Number(e?.idAtivo) === Number(id))
            try {

              setHistorico(historicoIntangivel);
              setNomeAtivo(historicoIntangivel[0].nomeAtivo)
              console.log('historico: ', historicoIntangivel)
            } catch(error){
              setHistorico([]);
              console.log('historico: ', historicoIntangivel)
              console.log('num tem aqui não >:(')
            }
          }
        }

      } else {
        console.log("Não tem")
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setHistorico([]); // Limpa o histórico em caso de erro
      setNomeAtivo("Erro ao carregar histórico");
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
                {historico.map((evento: EventoHistorico) => (
                  <div key={evento.idAtivo} className="uia-timeline__groups">
                    <span className="uia-timeline__year" aria-hidden="true">{evento.dataAlteracao.split("-")[0]}</span>
                    <section className="uia-timeline__group">
                      <div className="uia-timeline__point uia-card" data-uia-card-skin="1" data-uia-card-mod="1">
                        <div className="uia-card__container">
                          <div className="uia-card__intro">
                            <h3 className="ra-heading">{evento.nomeAtivo}</h3>
                            <span className="uia-card__time">
                              <time dateTime={evento.dataAlteracao}>
                                <span className="uia-card__day">{evento.dataAlteracao.split("-")[2]}</span>{" "}
                                <span>{meses[parseInt(evento.dataAlteracao.split("-")[1]) - 1]}</span>
                              </time>
                            </span>
                          </div>
                          <div className="uia-card__body">
                            <div className="uia-card__description">
                              <p>{evento.nomeUsuario}, {evento.departamentoUsuario}</p>
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
