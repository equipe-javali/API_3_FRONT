import React, { Component } from 'react';
import getLocalToken from '../utils/getLocalToken';

interface State {
    ativosExpirando: { id: number, expiryDate: string }[];
}

export default class Notificacao extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            ativosExpirando: []
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
            const ativosExpirando = data.filter((ativo: any) => {
                const expiryDate = new Date(ativo.garantia);
                const today = new Date();
                const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 10;
            }).map((ativo: any, index: number) => {
                const expiryDate = new Date(ativo.garantia);
                return { id: ativo.id, expiryDate: expiryDate.toISOString() };
            });
            this.setState({ ativosExpirando });
        })
        .catch(error => {
            console.error('Houve um erro ao buscar os dados da garantia:', error);
        });
    }

    render() {
        const { ativosExpirando } = this.state;
    
        if (ativosExpirando.length === 0) {
            return null;
        }
    
        return (
            <div>
                {ativosExpirando.map((ativo: { id: number, expiryDate: string }, index: number) => {
                    const today = new Date();
                    const expiryDate = new Date(ativo.expiryDate);
                    const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
                    if (expiryDate < today) {
                        return (
                            <div key={index}>{`A garantia do ativo ${ativo.id} expirou em ${expiryDate.toLocaleDateString()}.`}</div>
                        );
                    } else {
                        return (
                            <div key={index}>{`A garantia do ativo ${ativo.id} está prestes a expirar em ${diffDays} dias.`}</div>
                        );
                    }
                })}
            </div>
        );
    }
}