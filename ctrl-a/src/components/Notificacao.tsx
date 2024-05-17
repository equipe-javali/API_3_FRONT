import React, { Component } from 'react';
import getLocalToken from '../utils/getLocalToken';

interface State {
    ativosGarantia: { id: number, dataGarantia: string }[];
    ativosExpiracao: { id: number, dataExpiracao: string }[];
}

interface Props {
    onUpdate: (garantiaCount: number, expiracaoCount: number) => void;
    className?: string;
}


export default class Notificacao extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            ativosGarantia: [],
            ativosExpiracao: []
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
                this.props.onUpdate(this.state.ativosGarantia.length, this.state.ativosExpiracao.length);
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
                this.props.onUpdate(this.state.ativosGarantia.length, this.state.ativosExpiracao.length);
            });
        })
        .catch(error => {
            console.error('Houve um erro ao buscar os dados de expiração:', error);
        });    
    }

    render() {
        const { ativosGarantia, ativosExpiracao } = this.state;
    
        if (ativosGarantia.length === 0 && ativosExpiracao.length === 0) {
            return null;
        }
    
        return (
            <div className={this.props.className}>
                {ativosGarantia.map((ativo: { id: number, dataGarantia: string }, index: number) => {
                    const today = new Date();
                    const dataGarantia = new Date(ativo.dataGarantia);
                    const diffTime = Math.abs(dataGarantia.getTime() - today.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
                    if (dataGarantia < today) {
                        return (
                            <div key={index}>{`A garantia do ativo ${ativo.id} expirou em ${dataGarantia.toLocaleDateString()}.`}</div>
                        );
                    } else {
                        return (
                            <div key={index}>{`A garantia do ativo ${ativo.id} está prestes a expirar em ${diffDays} dias.`}</div>
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
                            <div key={index}>{`A licença do ativo ${ativo.id} expirou em ${dataExpiracao.toLocaleDateString()}.`}</div>
                        );
                    } else {
                        return (
                            <div key={index}>{`A licença do ativo ${ativo.id} irá expirar em ${diffDays} dias.`}</div>
                        );
                    }
                })}
            </div>
        );
    }
}