import React, { Component } from 'react';
import getLocalToken from '../utils/getLocalToken';
import './css/Notificacao.css';
import moment from 'moment-timezone';

interface State {
    ativosGarantia: { id: number, dataGarantia: string }[];
    ativosExpiracao: { id: number, dataExpiracao: string }[];
    manutencoesProximas: { id: number, dataFim: string, ativo: any }[];
}

interface Props {
    onUpdate: (garantiaCount: number, expiracaoCount: number, manutencoesProximasLength: number) => void;
    className?: string;
}


export default class Notificacao extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            ativosGarantia: [],
            ativosExpiracao: [],
            manutencoesProximas: []
        };
    }
    componentDidMount() {
        const token = getLocalToken();
      
        const fetchAtivosTangiveis = fetch('http://localhost:8080/ativoTangivel/listagemTodos', { headers: { 'Authorization': token } }).then(res => res.json());
        const fetchAtivosIntangiveis = fetch('http://localhost:8080/ativoIntangivel/listagemTodos', { headers: { 'Authorization': token } }).then(res => res.json());
        const fetchManutencoes = fetch('http://localhost:8080/manutencao/listagemTodos', { headers: { 'Authorization': token } }).then(res => res.json());
      
        Promise.all([fetchAtivosTangiveis, fetchAtivosIntangiveis, fetchManutencoes])
          .then(([ativosTangiveisData, ativosIntangiveisData, manutencoesData]) => {
            const today = new Date();
            const dezDiasEmMilissegundos = 10 * 24 * 60 * 60 * 1000;       
           
            if (!Array.isArray(ativosTangiveisData)) {
              console.error('Dados de ativos tangíveis inválidos:', ativosTangiveisData);
              return;
            }
            if (!Array.isArray(ativosIntangiveisData)) {
              console.error('Dados de ativos intangíveis inválidos:', ativosIntangiveisData);
              return;
            }
            if (!Array.isArray(manutencoesData)) {
              console.error('Dados de manutenções inválidos:', manutencoesData);
              return;
            }
      
            
            const ativosGarantia = ativosTangiveisData.filter((ativo: any) => {
                
                const dataGarantia = moment.tz(ativo.garantia, 'YYYY-MM-DD', 'America/Sao_Paulo'); // Use seu fuso horário aqui
                const today = moment(); 
                return dataGarantia.diff(today, 'days') <= 10;
              }).map((ativo: any) => ({
                id: ativo.id,
                dataGarantia: ativo.garantia
              }));
      
              const ativosExpiracao = ativosIntangiveisData.filter((ativo: any) => {
                
                const dataExpiracao = moment.tz(ativo.dataExpiracao, 'YYYY-MM-DD', 'America/Sao_Paulo'); // Use seu fuso horário aqui
                const today = moment();
                return dataExpiracao.diff(today, 'days') <= 10;
              }).map((ativo: any) => ({
                id: ativo.id,
                dataExpiracao: ativo.dataExpiracao
              }));
      
              const manutencoesProximas = manutencoesData.filter((manutencao: any) => {
                
                const dataFim = moment.tz(manutencao.dataFim, 'YYYY-MM-DD', 'America/Sao_Paulo'); 
                const today = moment();
                return dataFim.isValid() && dataFim.isAfter(today) && dataFim.diff(today, 'days') <= 10;
              }).map((manutencao: any) => ({
                id: manutencao.id,
                dataFim: manutencao.dataFim,
                ativo: manutencao.ativo
              }));
      
              this.setState({ ativosGarantia, ativosExpiracao, manutencoesProximas }, () => {
                this.props.onUpdate(this.state.ativosGarantia.length, this.state.ativosExpiracao.length, this.state.manutencoesProximas.length);
              });
            })
            .catch(error => {
              console.error('Erro ao buscar os dados:', error);
            });
      }    
    
    
    render() {
        const { ativosGarantia, ativosExpiracao, manutencoesProximas } = this.state;
    
        if (ativosGarantia.length === 0 && ativosExpiracao.length === 0) {
            return null;
        }
    
        return (
            <div className={this.props.className}>
              <div className="notificacao">
                <ul>
                  {ativosGarantia.map((ativo, index) => {
                    const today = moment(); // Data de hoje usando Moment.js
                    const dataGarantia = moment(ativo.dataGarantia, 'YYYY-MM-DD');
                    const diffDays = dataGarantia.diff(today, 'days');
      
                    return (
                      <li key={index}>
                        {diffDays < 0
                          ? `A garantia do ativo ${ativo.id} terminou em ${dataGarantia.format("DD/MM/YYYY")}`
                          : `A garantia do ativo ${ativo.id} termina em ${diffDays} dias`}
                      </li>
                    );
                  })}
      
                  {ativosExpiracao.map((ativo, index) => {
                    const today = moment();
                    const dataExpiracao = moment(ativo.dataExpiracao, 'YYYY-MM-DD');
                    const diffDays = dataExpiracao.diff(today, 'days');
      
                    return (
                      <li key={index}>
                        {diffDays < 0
                          ? `A licença do ativo ${ativo.id} expirou em ${dataExpiracao.format("DD/MM/YYYY")}`
                          : `A licença do ativo ${ativo.id} expira em ${diffDays} dias`}
                      </li>
                    );
                  })}
      
                  {manutencoesProximas.map((manutencao, index) => {
                    const today = moment();
                    const dataFim = moment(manutencao.dataFim, 'YYYY-MM-DD');
                    const diffDays = dataFim.diff(today, 'days');
      
                    if (diffDays <= 10) {
                      return (
                        <li key={index}>{`A manutenção do ativo ${manutencao.ativo.id} termina em ${diffDays} dias`}</li>
                      );
                    }
                    return null; // Não renderiza nada se a manutenção não for próxima
                  })}
                </ul>
              </div>
            </div>
          );
        }
      }