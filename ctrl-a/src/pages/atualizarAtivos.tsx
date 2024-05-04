import React, { useEffect, useState } from 'react';
import './css/atualizarAtivo.css';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

interface Ativo {
    numeroIdentificacao: string,
    nome: string,
    dataAquisicao: string,
    custoAquisicao: number,
    marca: string,
    descricao: string,
    tipo: string,
    importancia: string,
    tag: string,
    responsavel: string,
    departamento: string,
    local: string
}

interface AtivoTangivel {
    garantia: string,
    taxaDepreciacao: number,
    periodoDepreciacao: string
}

interface AtivoIntangivel {
    expiracao: string,
    taxaAmortizacao: number,
    periodoAmortizacao: string
}

export default function AtualizarAtivo() {
    const { id } = useParams<{ id: string }>()
    const [formAtivo, setFormAtivo] = useState<Ativo>({
        // custoAquisicao: (ativo?.custoAquisicao || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), // Formatando o custo de aquisição em reais
        numeroIdentificacao: '',
        nome: '',
        dataAquisicao: '',
        custoAquisicao: 0,
        marca: '',
        descricao: '',
        tipo: '',
        importancia: '',
        tag: '',
        responsavel: '',
        departamento: '',
        local: ''
    });

    useEffect(() => {
        fetchAtivoTangivelData()
    })

    const fetchAtivoTangivelData = async () => {
        try {
            const respTangivel = await fetch(`http://localhost:8080/ativoTangivel/listagem/${id}`);
            if (respTangivel.ok) {
                const formAtivo = await respTangivel.json();
                setFormAtivo(formAtivo)
            } else {
                console.error('Failed to fetch user data:', respTangivel.statusText);
            }
        } catch (error) {
            console.error('Error fetching ativo data:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormAtivo({ ...formAtivo, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/ativoTangivel/atualizacao/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formAtivo)
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
            <h2 className='titulo'>
                Atualizar ativo ID: {id} / Número de identificação: {formAtivo.numeroIdentificacao}
            </h2>
            <div className='separados'>
                <div className='ladoEsquerdo'>
                    <h3 className='nomeAtivo'>Nome do ativo</h3>
                    <div className='dadosGerais'>
                        <div className='linha'>
                            <div className='coluna1'>
                                <div className='campoInput'>
                                    <label>Data da aquisição</label>
                                    <div className='inputContainer'>
                                        <input className='input' type='date' name='dataAquisicao' value={''}></input>
                                    </div>
                                </div>
                                <div className='campoInput'>
                                    <label>Custo da aquisição</label>
                                    <div className='inputContainer'>
                                        <input className='input' type='number' name='custoAquisicao' value={''}></input>
                                    </div>
                                </div>
                                <div className='campoInput'>
                                    <label>Taxa de depreciação</label> {/* tangivel */}
                                    <div className='inputContainer'>
                                        <input className='input' type='number' name='taxaDepreciacao' value={''}></input>
                                    </div>
                                </div>
                            </div>
                            <div className='coluna2'>
                                <div className='campoInput'>
                                    <label>Período de depreciação</label> {/* tangivel */}
                                    <div className='inputContainer'>
                                        <input className='input' type='text' name='periodoDepreciacao' value={''}></input>
                                    </div>
                                </div>
                                <div className='campoInput'>
                                    <label>Validade da garantia</label>
                                    <div className='inputContainer'>
                                        <input className='input' type='date' name='validade' value={''}></input>
                                    </div>
                                </div>
                                <div className='campoInput'>
                                    <label>Marca</label>
                                    <div className='inputContainer'>
                                        <input className='input' type='text' name='marca' value={''}></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='campoInput descricao'>
                            <label>Descrição</label>
                            <div className='inputContainer'>
                                <textarea className='descricao' name='descricao' value={''}></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='ladoDireito'>
                    <div className='superiorDireito'>
                        <div className='linha'>
                            <div className='campoInput'>
                                <label>Tipo</label>
                                <div className='inputContainer'>
                                    <input className='input' type='text' name='tipo' value={''}></input>
                                </div>
                            </div>
                            <div className='campoInput'>
                                <label>Grau de importância</label>
                                <div className='inputContainer'>
                                    <select className='input' name='grauImportancia' value={''}>
                                        <option value={''}>Selecione grau de importância</option>
                                        <option value={'Alto'}>Alto</option>
                                        <option value={'Medio'}>Médio</option>
                                        <option value={'Baixo'}>Baixo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='linha'>
                            <div className='campoInput'>
                                <label>Tag</label>
                                <div className='inputContainer'>
                                    <input className='input' name='tag' value={''}></input>
                                </div>
                            </div>
                            <div className='campoInput'>
                                <label>Status</label>
                                <div className='inputContainer'>
                                    <input className='input' name='status' value={''}></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='inferiorDireito'>
                        <div className='coluna'>
                            <div className='campoInput'>
                                <label>Responsável</label>
                                <div className='inputContainer'>
                                    <select className='input' name='status' value={''}>
                                        <option value={''}>Selecione responsável</option>
                                        <option value={'user1'}>Usuário 1</option>
                                        <option value={'user2'}>Usuário 2</option>
                                    </select>
                                </div>
                            </div>
                            <div className='campoInput'>
                                <label>Departamento</label>
                                <div className='inputContainer'>
                                    <select className='input' name='status' value={''}>
                                        <option value={''}>Selecione departamento</option>
                                        <option value={'Departamento 1'}>Departamento 1</option>
                                        <option value={'Departamento 2'}>Departamento 2</option>
                                    </select>
                                </div>
                            </div>
                            <div className='campoInput'>
                                <label>Localização</label>
                                <div className='inputContainer'>
                                    <input className='input' name='status' value={''}></input>
                                </div>
                            </div>
                        </div>
                        <div className='botoes'>
                            <Link to={`/HistoricoManutencao/${id}`}>Histórico Manutenção</Link>
                            <button type="submit">Adicionar pedido de manutenção</button>
                            <button type="submit" onClick={handleSubmit}>Atualizar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}