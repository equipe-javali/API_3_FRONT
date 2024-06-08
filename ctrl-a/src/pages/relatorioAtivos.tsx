import { useState, useEffect } from "react"
import "./css/relatorioAtivos.css"

export default function RelatorioAtivos({ dataInicial, dataFinal }: { dataInicial: string, dataFinal: string }) {
    const [selectedButton, setSelectedButton] = useState("geral");
    const [dadosAtivos, setDadosAtivos] = useState([]); 
  
    let selected = (value: string) => {
      setSelectedButton(value);
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `/api/ativos?dataInicial=${dataInicial}&dataFinal=${dataFinal}&tipo=${selectedButton}`
          );
          const data = await response.json();
          setDadosAtivos(data); 
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
          
        }
      };
  
      fetchData(); 
    }, [dataInicial, dataFinal, selectedButton]); 

    return (
        <div className="relatorios-ativos">
            
            {dataInicial}
            {dataFinal}
            <div className="linha1Ativos">
                <div className="totalAtivos">
                    <p>TOTAL DE ATIVOS</p>
                    <p className="valorCard">2000</p>
                </div>
                <div className="valorTotalAtivos">
                    <p>VALOR TOTAL DE ATIVOS</p>
                    <p className="valorCard">R$2000,00</p>
                </div>
                <div className="btnsTiposAtivos">
                    <button className={selectedButton == "geral" ? "btnAtivos btnSelected" : "btnAtivos"} value={"geral"} onClick={() => selected("geral")}>Dados gerais</button>
                    <button className={selectedButton == "tangiveis"? "btnAtivos btnSelected" : "btnAtivos"} value={"tangiveis"} onClick={() => selected("tangiveis")}>Tangíveis</button>
                    <button className={selectedButton == "intangiveis" ? "btnAtivos btnSelected" : "btnAtivos"} value={"intangivel"} onClick={() => selected("intangiveis")}>Intangíveis</button>
                </div>
            </div>
            <div className="linha2Ativos">
                <div className="statusAtivos">
                    <p>STATUS DOS ATIVOS</p>
                    <div className="graficoAtivos"></div>
                </div>
                <div className="qntdLocalAtivos">
                    <p>QUANTIDADE DE ATIVOS X LOCAL</p>
                    <div className="graficoAtivos"></div>
                </div>
            </div>
        </div>
    )
}