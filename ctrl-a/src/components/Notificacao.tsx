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
    private intervalId: NodeJS.Timeout | null = null;
    constructor(props: Props) {
        super(props);
        this.state = {
            ativosGarantia: [],
            ativosExpiracao: [],
            manutencoesProximas: []
        };
    }

    componentDidMount() {
        this.buscarDadosAtualizados();
        this.intervalId = setInterval(this.buscarDadosAtualizados, 3000);
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    buscarDadosAtualizados = () => {
        const token = getLocalToken();

        Promise.all([
            fetch('http://localhost:8080/ativoTangivel/listagemTodos', { headers: { 'Authorization': token } }).then(res => res.json()),
            fetch('http://localhost:8080/ativoIntangivel/listagemTodos', { headers: { 'Authorization': token } }).then(res => res.json()),
            fetch('http://localhost:8080/manutencao/listagemTodos', { headers: { 'Authorization': token } }).then(res => res.json())
        ])
            .then(([ativosTangiveisData, ativosIntangiveisData, manutencoesData]) => {

                if (!Array.isArray(ativosTangiveisData) || !Array.isArray(ativosIntangiveisData) || !Array.isArray(manutencoesData)) {
                    console.error('Dados inválidos recebidos do servidor.');
                    return;
                }
                if (!Array.isArray(manutencoesData)) {
                    console.error('Dados de manutenções inválidos:', manutencoesData);
                    return;
                }


                const ativosGarantia = ativosTangiveisData.filter((ativo: any) => {
                    const dataGarantia = moment(ativo.garantia); // Remove a necessidade de tz
                    const today = moment();
                    return dataGarantia.isValid() && dataGarantia.diff(today, 'days') <= 10;
                }).map((ativo: any) => ({
                    id: ativo.id,
                    dataGarantia: ativo.garantia
                }));

                const ativosExpiracao = ativosIntangiveisData.filter((ativo: any) => {
                    const dataExpiracao = moment(ativo.dataExpiracao);
                    const today = moment();
                    return dataExpiracao.isValid() && dataExpiracao.diff(today, 'days') <= 10;
                }).map((ativo: any) => ({
                    id: ativo.id,
                    dataExpiracao: ativo.dataExpiracao
                }));

                const manutencoesProximas = manutencoesData.filter((manutencao: any) => {
                    const dataFim = moment(manutencao.dataFim);
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
    };


    render() {
        const { ativosGarantia, ativosExpiracao, manutencoesProximas } = this.state;

        // Verifica se há alguma notificação
        const temNotificacoes = ativosGarantia.length > 0 || ativosExpiracao.length > 0 || manutencoesProximas.length > 0;

        return (
            <div className={this.props.className}>
                <div className="notificacao">
                    {temNotificacoes ? (
                        <ul>
                            {ativosGarantia.map((ativo, index) => {
                                const today = moment();
                                const dataGarantia = moment(ativo.dataGarantia, 'YYYY-MM-DD');
                                const diffDays = dataGarantia.diff(today, 'days');

                                return (
                                    <li key={index}>
                                        {diffDays === 0
                                            ? `A garantia do ativo ${ativo.id} termina hoje`
                                            : diffDays === 1
                                                ? `A garantia do ativo ${ativo.id} termina amanhã`
                                                : diffDays < 0
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
                                        {diffDays === 0
                                            ? `A licença do ativo ${ativo.id} expira hoje`
                                            : diffDays === 1
                                                ? `A licença do ativo ${ativo.id} expira amanhã`
                                                : diffDays < 0
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
                                        <li key={index}>
                                            {diffDays === 0
                                                ? `A manutenção do ativo ${manutencao.ativo.id} termina hoje`
                                                : diffDays === 1
                                                    ? `A manutenção do ativo ${manutencao.ativo.id} termina amanhã`
                                                    : `A manutenção do ativo ${manutencao.ativo.id} termina em ${diffDays} dias`}
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ul>
                    ) : (
                        <p className="sem-notificacoes">Não há notificações para exibir</p>
                    )}
                </div>
            </div>
        );
    }
}