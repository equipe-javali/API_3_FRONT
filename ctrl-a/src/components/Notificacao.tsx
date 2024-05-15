import React, { Component } from 'react';

interface State {
    expiryDate: Date | null;
}

export default class Notificacao extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            expiryDate: null
        };
    }

    componentDidMount() {
        fetch('http://localhost:8080/ativoTangivel/cadastro')
            .then(response => response.json())
            .then(data => {
                this.setState({ expiryDate: new Date(data.garantia) });
            })
            .catch(error => {
                console.error('Houve um erro ao buscar os dados da garantia:', error);
            });
    }

    render() {
        const { expiryDate } = this.state;

        if (!expiryDate) {
            return null;
        }

        const today = new Date();
        const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 10) {
            return <div>A garantia do seu ativo está prestes a expirar em {diffDays} dias.</div>
        }

        return null;
    }
}