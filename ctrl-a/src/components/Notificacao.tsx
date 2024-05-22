import React, { Component } from 'react';
import getLocalToken from '../utils/getLocalToken';
import './css/Notificacao.css';

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
    
        fetch('http://localhost:8080/ativoTangivel/listagemTodos', {
            headers: {
                'Authorization': token 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.status === 204 || response.status === 205) {
                return null;
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos da API:', data); 
    
            if (!Array.isArray(data)) {
                console.error('Dados recebidos não são um array:', data);
                return;
            }
            const ativosGarantia = data.filter((ativo: any) => {
                const dataGarantia = new Date(ativo.garantia);
                const today = new Date();
                const diffTime = Math.abs(dataGarantia.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 10;
            }).map((ativo: any, index: number) => {
                const dataGarantia = new Date(ativo.garantia);
                return { id: ativo.id, dataGarantia: dataGarantia.toISOString() };
            });
            this.setState({ ativosGarantia }, () => {
                this.props.onUpdate(this.state.ativosGarantia.length, this.state.ativosExpiracao.length, this.state.manutencoesProximas.length);
            });
        })
        .catch(error => {
            console.error('Houve um erro ao buscar os dados da garantia:', error);
        });
        fetch('http://localhost:8080/ativoIntangivel/listagemTodos', {
            headers: {
                'Authorization': token 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.status === 204 || response.status === 205) {
                return null;
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos da API:', data); 

            if (!Array.isArray(data)) {
                console.error('Dados recebidos não são um array:', data);
                return;
            }
            const ativosExpiracao = data.map((ativo: any, index: number) => {
                const dataExpiracao = new Date(ativo.dataExpiracao);
                return { id: ativo.id, dataExpiracao: dataExpiracao.toISOString() };
            });
            this.setState({ ativosExpiracao }, () => {
                this.props.onUpdate(this.state.ativosGarantia.length, this.state.ativosExpiracao.length, this.state.manutencoesProximas.length);
            });
        })
        .catch(error => {
            console.error('Houve um erro ao buscar os dados de expiração:', error);
        });       

        fetch('http://localhost:8080/manutencao/listagemTodos', {
            headers: {
                'Authorization': token 
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.status === 204 || response.status === 205) {
                return null;
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos da API:', data); 

            if (!Array.isArray(data)) {
                console.error('Dados recebidos não são um array:', data);
                return;
            }
            const manutencoesProximas = data.filter((manutencao: any) => {
                const dataFim = new Date(manutencao.dataFim);
                const today = new Date();
                const diffTime = Math.abs(dataFim.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 10;
            }).map((manutencao: any, index: number) => {
                const dataFim = new Date(manutencao.dataFim);
                return { id: manutencao.id, dataFim: dataFim.toISOString(), ativo: manutencao.ativo };
            });
            this.setState({ manutencoesProximas }, () => {
                this.props.onUpdate(this.state.ativosGarantia.length, this.state.ativosExpiracao.length, this.state.manutencoesProximas.length);
            });
        })
        .catch(error => {
            console.error('Houve um erro ao buscar os dados de manutenção:', error);
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
                        {ativosGarantia.map((ativo: { id: number, dataGarantia: string }, index: number) => {
                            const today = new Date();
                            const dataGarantia = new Date(ativo.dataGarantia);
                            const diffTime = Math.abs(dataGarantia.getTime() - today.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
                            if (dataGarantia < today) {
                                return (
                                    <li key={index}>{`A garantia do ativo ${ativo.id} encerrou ${dataGarantia.toLocaleDateString()}`}</li>
                                );
                            } else {
                                return (
                                    <li key={index} >{`A garantia do ativo ${ativo.id} termina em ${diffDays} dias`}</li>
                                );
                            }
                        })}
        
                        {ativosExpiracao.map((ativo: { id: number, dataExpiracao: string }, index: number) => {
                            const today = new Date();
                            const dataExpiracao = new Date(ativo.dataExpiracao);
                            const diffTime = Math.abs(dataExpiracao.getTime() - today.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
                            if (dataExpiracao < today) {
                                return (
                                    <li key={index} >{`A licença do ativo ${ativo.id} expirou em ${dataExpiracao.toLocaleDateString()}`}</li>
                                );
                            } else {
                                return (
                                    <li key={index} >{`A licença do ativo ${ativo.id} irá expirar em ${diffDays} dias`}</li>
                                );
                            }
                        })}

                    {manutencoesProximas.map((manutencao: { id: number, dataFim: string, ativo: any }, index: number) => {
                        const today = new Date();
                        const dataFim = new Date(manutencao.dataFim);
                        const diffTime = Math.abs(dataFim.getTime() - today.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays === 10) {
                            return (
                                <li key={index} >{`A manutenção do ativo ${manutencao.ativo.id} irá terminar em ${diffDays} dias`}</li> // Use o ativo aqui
                            );
                        }
                    })}
                    </ul>
                </div>
            </div>
        );
    }
}