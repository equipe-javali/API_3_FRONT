import React, { useState } from 'react';
import './css/atualizarAtivo.css';

interface AtivoTangivel {
    numeroIdentificacao: string,
    nome: string,
    dataAquisicao: string,
    custoAquisicao: number,
    taxa: number,
    periodo: string,
    validade: string,
    marca: string,
    descricao: string,
    tipo: string,
    importancia: string,
    tag: string,
    responsavel: string,
    departamento: string,
    local: string
}

export default function AtualizarAtivo() {
    const [formValues, setFormValues] = useState<AtivoTangivel>({
        // custoAquisicao: (ativo?.custoAquisicao || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), // Formatando o custo de aquisição em reais
        numeroIdentificacao: '',
        nome: '',
        dataAquisicao: '',
        custoAquisicao: 0,
        taxa: 0,
        periodo: '',
        validade: '',
        marca: '',
        descricao: '',
        tipo: '',
        importancia: '',
        tag: '',
        responsavel: '',
        departamento: '',
        local: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/ativoTangivel/atualizacao/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues)
            });
            if (response.ok) {
                console.log('Ativo atualizado com sucesso!');
            } else {
                console.error('Erro ao atualizar o ativo:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao processar requisição:', error);
        }
    };

    return (
        <div className="atualizarAtivo">


            <button type="submit" onClick={handleSubmit}>Atualizar</button>
        </div>
    );
}
