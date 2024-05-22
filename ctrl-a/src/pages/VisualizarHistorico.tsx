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
      const urls = [
        `http://localhost:8080/historicoAtivoTangivel/listagemTodos`,
        `http://localhost:8080/historicoAtivoIntangivel/listagemTodos`,
      ];

      let historicoFiltrado: EventoHistorico[] = [];

      for (const url of urls) {
        const response = await fetch(url, {
          headers: { Authorization: token },
        });

        if (response.ok) {
          const data: EventoHistorico[] = await response.json();
          historicoFiltrado = data.filter(
            (e) => Number(e?.idAtivo) === Number(id)
          );

          if (historicoFiltrado.length > 0) {
            break; // Encontrou o histórico, sai do loop
          }
        }
      }

      // Ordena o histórico por data em ordem decrescente (mais recente primeiro)
      historicoFiltrado.sort((a, b) => {
        return Date.parse(b.dataAlteracao) - Date.parse(a.dataAlteracao);
      });

      setHistorico(historicoFiltrado);
      setNomeAtivo(historicoFiltrado.length > 0 ? historicoFiltrado[0].nomeAtivo : "Ativo sem histórico");
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
                {historico.map((evento: EventoHistorico) => {
                  const dataAlteracao = new Date(evento.dataAlteracao);
                  const dia = dataAlteracao.getDate();
                  const mes = meses[dataAlteracao.getMonth()];
                  const ano = dataAlteracao.getFullYear();

                  return (
                    <div key={`${evento.idAtivo}-${evento.dataAlteracao}`} className="uia-timeline__groups">
                      <span className="uia-timeline__year" aria-hidden="true">{ano}</span>
                      <section className="uia-timeline__group">
                        <div className="uia-timeline__point uia-card" data-uia-card-skin="1" data-uia-card-mod="1">
                          <div className="uia-card__container">
                            <div className="uia-card__intro">
                              <h3 className="ra-heading">{evento.nomeUsuario} ({evento.departamentoUsuario})</h3>
                              <span className="uia-card__time">
                                <time dateTime={evento.dataAlteracao}>
                                  <span className="uia-card__day">{dia}</span>{" "}
                                  <span>{mes}</span>
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

// import React, { useEffect, useState } from "react";
// import './css/visualizarHistorico.css';
// import getLocalToken from "../utils/getLocalToken";
// import { useParams } from "react-router-dom";

// interface EventoHistorico {
//   idAtivo: number,
//   idAtivoTangivel?: number,
//   idAtivoIntangivel?: number,
//   dataAlteracao: string,
//   nomeAtivo: string,
//   nomeUsuario: string,
//   departamentoUsuario: string
// }

// interface DadosAtivo {
//   nome: string;
//   historico: EventoHistorico[];
// }

// const meses = [
//   "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
//   "Jul", "Ago", "Set", "Out", "Nov", "Dez"
// ];

// export default function VisualizarHistorico() {
//   const [nomeAtivo, setNomeAtivo] = useState<string>('');
//   const [historico, setHistorico] = useState<EventoHistorico[] | any>([]);
//   const token = getLocalToken();
//   const { id } = useParams();

//   useEffect(() => {
//     fetchHistorico();
//   }, []);

//   async function fetchHistorico() {
//     try {
//       let tangivel = await fetch('http://localhost:8080/historicoAtivoTangivel/listagemTodos', {
//         headers: {
//           "Authorization": token
//         }
//       });
//       const data: EventoHistorico[] = await tangivel.json();
//       const historicoFiltrado = data.filter(e => Number(e?.idAtivo) === Number(id))

//       if (tangivel.ok) {
//         if (historicoFiltrado.length > 0) {
//           if (historicoFiltrado[0].idAtivoTangivel) {
//             setHistorico(historicoFiltrado);
//             setNomeAtivo(historicoFiltrado[0].nomeAtivo);
//             console.log('historico FILTRADO: ', historicoFiltrado)

//           } else if (historicoFiltrado[0].idAtivoIntangivel) {
//             const intangivel = await fetch('http://localhost:8080/historicoAtivoIntangivel/listagemTodos', {
//               headers: {
//                 "Authorization": token
//               }
//             })
//             if (intangivel.ok) {
//               const dataIntangivel: EventoHistorico[] = await intangivel.json()
//               const historicoIntangivel = dataIntangivel.filter(e => Number(e?.idAtivo) === Number(id))

//               console.log('Caiu pra fora do tangivel')
//               try {
//                 setHistorico(historicoIntangivel);
//                 setNomeAtivo(historicoIntangivel[0].nomeAtivo)
//                 console.log('historico: ', historicoIntangivel)
//               } catch(error){
//                 setHistorico([]);
//                 console.log('historico: ', historicoIntangivel)
//                 console.log('num tem aqui não >:(')
//               }
//             }
//           } else {
//             console.log('status n ok')
//           }
          
//         } else {
//           const intangivel = await fetch('http://localhost:8080/historicoAtivoIntangivel/listagemTodos', {
//             headers: {
//               "Authorization": token
//             }
//           })
//           console.log('entrou')

//           if (intangivel.ok) {
//             const dataIntangivel: EventoHistorico[] = await intangivel.json()
//             const historicoIntangivel = dataIntangivel.filter(e => Number(e?.idAtivo) === Number(id))
//             try {
//               setHistorico(historicoIntangivel);
//               setNomeAtivo(historicoIntangivel[0].nomeAtivo)
//               console.log('historico: ', historicoIntangivel)
//             } catch(error){
//               setHistorico([]);
//               console.log('historico: ', historicoIntangivel)
//               console.log('num tem aqui não >:(')
//             }
//           }
//         }

//       } else {
//         console.log("Não tem")
//       }
//     } catch (error) {
//       console.error('Erro ao carregar dados:', error);
//     }
//   }

//   return (
//     <div className="VisualizarHistorico">
//       <h1> Histórico do {nomeAtivo}</h1>
//       <div className="Caixa_Historico">
//         <div className="page" data-uia-timeline-skin="4" data-uia-timeline-adapter-skin-4="uia-card-skin-#1">
//           <div className="uia-timeline">
//             <div className="uia-timeline__container">
//               <div className="uia-timeline__line"></div>
//               <div className="uia-timeline__annual-sections">
//                 {/* {historico.slice().map((evento) => (
//                   <div key={evento.id} className="uia-timeline__groups">
//                     <span className="uia-timeline__year" aria-hidden="true">{evento.ano}</span>
//                     <section className="uia-timeline__group">
//                       <div className="uia-timeline__point uia-card" data-uia-card-skin="1" data-uia-card-mod="1">
//                         <div className="uia-card__container">
//                           <div className="uia-card__intro">
//                             <h3 className="ra-heading">{evento.evento}</h3>
//                             <span className="uia-card__time">
//                               <time dateTime={evento.ano.toString()}>
//                                 <span className="uia-card__day">{evento.data.split(" ")[0]}</span>{" "}
//                                 <span>{evento.data.split(" ")[1]}</span>
//                               </time>
//                             </span>
//                           </div>
//                           <div className="uia-card__body">
//                             <div className="uia-card__description">
//                               <p>{evento.descricao}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </section>
//                   </div>
//                 ))} */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
