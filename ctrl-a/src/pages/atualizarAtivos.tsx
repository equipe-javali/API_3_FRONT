import React, { useState } from 'react';
import './css/atualizarAtivo.css'; // Certifique-se de ajustar o nome do seu arquivo CSS

interface Ativo {
    id: number;
    nome: string;
    custoAquisicao: number;
    tipo: string;
    marca: string;
    numeroIdentificacao: string;
    dataAquisicao: string; 
    descricao: string;
}

interface Props {
    ativo?: Ativo; // tornando a propriedade opcional
}

export default function AtualizarAtivo({ ativo }: Props) {
    const [inputValues, setInputValues] = useState({
        nome: ativo?.nome || '',
        custoAquisicao: (ativo?.custoAquisicao || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), // Formatando o custo de aquisição em reais
        tipo: ativo?.tipo || '',
        marca: ativo?.marca || '',
        numeroIdentificacao: ativo?.numeroIdentificacao || '',
        dataAquisicao: ativo?.dataAquisicao || '',
        descricao: ativo?.descricao || ''
    });

    const [formErrors, setFormErrors] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validando os campos
        const errors: string[] = [];
        if (!inputValues.nome) {
            errors.push('Nome é obrigatório.');
        }
        if (!inputValues.custoAquisicao) {
            errors.push('Custo de aquisição é obrigatório.');
        }
        if (!inputValues.tipo) {
            errors.push('Tipo é obrigatório.');
        }
        if (!inputValues.marca) {
            errors.push('Marca é obrigatória.');
        }
        if (!inputValues.numeroIdentificacao) {
            errors.push('Número de identificação é obrigatório.');
        }
        if (!inputValues.dataAquisicao) {
            errors.push('Data de aquisição é obrigatória.');
        }
        if (!inputValues.descricao) {
            errors.push('Descrição é obrigatória.');
        }

        setFormErrors(errors);

        // Se não houver erros, envia o formulário
        if (errors.length === 0) {
            try {
                if (!ativo) {
                    console.error('Ativo não definido.');
                    return;
                }

                const response = await fetch(`http://localhost:8080/ativo/${ativo.id}/atualizar`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(inputValues)
                });
                if (response.ok) {
                    console.log('Ativo atualizado com sucesso!');
                } else {
                    console.error('Erro ao atualizar o ativo:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao processar requisição:', error);
            }
        }
    };

    return (
        <div className="atualizarAtivo"> 
            <form onSubmit={handleSubmit} className="primeira-parte"> 
                <h1>Atualizar Ativo</h1> 
                {formErrors.length > 0 && (
                    <div className="error-list">
                        <ul>
                            {formErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div>
                    <label>Nome:</label>
                    <input type="text" name="nome" value={inputValues.nome} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Custo de Aquisição:</label>
                    <input type="text" name="custoAquisicao" value={inputValues.custoAquisicao} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Tipo:</label>
                    <input type="text" name="tipo" value={inputValues.tipo} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Marca:</label>
                    <input type="text" name="marca" value={inputValues.marca} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Número Identificador:</label>
                    <input type="text" name="numeroIdentificacao" value={inputValues.numeroIdentificacao} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Data de Aquisição:</label>
                    <input type="date" name="dataAquisicao" value={inputValues.dataAquisicao} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Descrição:</label>
                    <textarea name="descricao" value={inputValues.descricao} onChange={handleInputChange} />
                </div>
                <button type="submit">Atualizar</button>
            </form>
        </div>
    );
}