import React, { useEffect, useState } from 'react';
import './css/atualizarAtivo.css';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Modal from '../components/modal/modal';

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
    responsavel: {
        id: number,
        nome: string,
        departamento: string
    },
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

interface Usuario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    nascimento: string;
    departamento: string;
    telefone: string;
    usuariologin: UsuarioLogin[];
};

type UsuarioLogin = {
    id: number;
    senha: string;
}

type Manutencao = {
    id: number;
    idAtivo: Ativo;
    dataInicio: string;
    dataFim: string;
    custo: number;
    tipo: string;
    descricao: string;
    localizacao: string;
};

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
        responsavel: {
            id: 0,
            nome: '',
            departamento: ''
        },
        departamento: '',
        local: ''
    });
    const [ativoTangivel, setAtivoTangivel] = useState<AtivoTangivel | null>(null);
    const [ativoIntangivel, setAtivoIntangivel] = useState<AtivoIntangivel | null>(null);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
    const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
    const [showManutencaoModal, setShowManutencaoModal] = useState<boolean>(false);
    const [manutencaoData, setManutencaoData] = useState<Manutencao>({
        id: 0,
        idAtivo: formAtivo,
        tipo: '',
        descricao: '',
        localizacao: '',
        custo: 0,
        dataInicio: '',
        dataFim: '',

    });
    const [manutencao, setManutencao] = useState<Manutencao[]>([]);

    function emManutencao(): boolean {
        if (manutencoes.length <= 0) {
            return false;
        }
        return Date.parse(manutencoes[0].dataInicio) < Date.now() && Date.now() < Date.parse(manutencoes[0].dataFim);
    }
    function handleManutencaoDataChange(event: React.ChangeEvent<HTMLInputElement>) {
        setManutencaoData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value,
            ativoId: prevData.idAtivo,
        })) }

        function localAtivo() {
            if (emManutencao()) {
                return manutencoes[0].localizacao;
            } else {
                return formAtivo.responsavel.departamento;
            }
        }


        useEffect(() => {
            fetchAtivoData()
            fetchExtraData()
        }, []);

        const [statusA, setStatusA] = useState('');
        useEffect(() => {
            if (formAtivo.responsavel?.departamento === null) {
                setStatusA('Não alocado');
            }
            else if (emManutencao()) {
                setStatusA('Em manutenção');
            } else {
                setStatusA('Em uso');
            }
        }, [formAtivo.responsavel, manutencoes]);

        const fetchExtraData = async () => {
            fetch('http://localhost:8080/usuario/listagemTodos')
                .then(response => {
                    if (!response.ok) {
                        console.log(`Não foi possível listar os ativos! Erro: ${response.status}`);
                        console.log("Erro");
                    }
                    return response.json();
                })
                .then(data => setUsuarios(data))
                .catch(error => {
                    console.log(`Erro ao processar requisição! Erro: ${error}`);
                    console.log("Erro");
                });

            fetch(`http://localhost:8080/manutencao/listagem/${id}`)
                .then(response => {
                    if (!response.ok) {
                        console.error(`Não foi possível listar as manutenções do ativo! Erro: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setManutencoes(
                        (data as Manutencao[]).sort((a, b) => Date.parse(a.dataInicio) - Date.parse(b.dataInicio))
                    )
                })
                .catch(error => {
                    console.error(`Erro ao processar requisição! Erro: ${error}`);
                });
        }

        const fetchAtivoData = async () => {
            try {
                const respTangivel = await fetch(`http://localhost:8080/ativoTangivel/listagem/${id}`);
                if (respTangivel.ok) {
                    const ativoTangivelData = await respTangivel.json();
                    setAtivoTangivel(ativoTangivelData);
                } else {
                    console.error('Erro ao encontrar ativo tangivel:', respTangivel.statusText);
                }

                if (respTangivel.status === 404) {
                    const respIntangivel = await fetch(`http://localhost:8080/ativoIntangivel/listagem/${id}`);
                    if (respIntangivel.ok) {
                        const ativoIntangivelData = await respIntangivel.json();
                        setAtivoIntangivel(ativoIntangivelData);
                    } else {
                        console.error('Erro ao encontrar ativo intangivel:', respIntangivel.statusText);
                    }
                }

                const respAtivo = await fetch(`http://localhost:8080/ativo/listagem/${id}`);
                if (respAtivo.ok) {
                    const formAtivoData = await respAtivo.json();
                    setFormAtivo(formAtivoData);
                } else {
                    console.error('Erro ao encontrar ativo:', respAtivo.statusText);
                }
            } catch (error) {
                console.error('Erro ao listar ativo:', error);
            }
        };

        const tipoMapping: { [key: string]: number } = {
            "Preventiva": 1,
            "Corretiva": 2,
            "Preditiva": 3
        };

        const reverseTipoMapping: { [key: number]: string } = {
            1: "Preventiva",
            2: "Corretiva",
            3: "Preditiva"
        };

        function toggleModal() {
            setShowManutencaoModal(!showManutencaoModal);
        }

        function handleManutencaoSubmit() {
            const currentDate = new Date().toISOString().split('T')[0];
            const manutencaoDataWithDates = {
                ...manutencaoData,
                tipo: typeof manutencaoData.tipo === 'string' ? tipoMapping[manutencaoData.tipo] || 0 : manutencaoData.tipo,
                dataInicio: manutencaoData.dataInicio ? new Date(manutencaoData.dataInicio).toISOString() : currentDate,
                dataFim: manutencaoData.dataFim ? new Date(manutencaoData.dataFim).toISOString() : null,
                ativo: { id: manutencaoData.idAtivo },
            };

            fetch('http://localhost:8080/manutencao/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(manutencaoDataWithDates),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Manutenção cadastrada com sucesso!', data);
                    setShowManutencaoModal(false);
                    setManutencao(prevManutencao => [...prevManutencao, data]);

                    setManutencaoData({
                        id: 0,
                        idAtivo: formAtivo,
                        tipo: '',
                        descricao: '',
                        localizacao: '',
                        custo: 0,
                        dataInicio: '',
                        dataFim: '',
                    });
                })
                .catch(error => console.error('Error:', error));
        }

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormAtivo({ ...formAtivo, [name]: value });
        };

        function handleUserChange(event: React.ChangeEvent<HTMLSelectElement>) {
            const userId = Number(event.target.value);
            const user = usuarios.find(u => u.id === userId);
            setSelectedUser(user || null);
        }

        function handleTextareaDataChange (event: React.ChangeEvent<HTMLTextAreaElement>) {
            setManutencaoData(prevData => ({
                ...prevData,
                [event.target.name]: event.target.value,
                ativoId: prevData.idAtivo, 
            }));
        };       
        function handleSelectDataChange(event: React.ChangeEvent<HTMLSelectElement>) {        
            setManutencaoData(prevData => ({
                ...prevData,
                [event.target.name]: event.target.value,
                ativoId: prevData.idAtivo, 
            }));
        }

        function handleCancel() {
            setShowManutencaoModal(false);
        }

        const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
            e.preventDefault();
            try {
                if (ativoTangivel != null) {
                    const response = await fetch(`http://localhost:8080/ativoTangivel/atualizacao/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'id': id,
                            'ativo': {
                                'id': id,
                                'nome': formAtivo.nome,
                                'custoAquisicao': formAtivo.custoAquisicao,
                                'tipo': formAtivo.tipo,
                                'tag': formAtivo.tag,
                                'grauImportancia': formAtivo.importancia,
                                'idResponsavel': formAtivo.responsavel,
                                'descricao': formAtivo.descricao,
                                'numeroIdentificacao': formAtivo.numeroIdentificacao,
                                'marca': formAtivo.marca,
                                'dataAquisicao': formAtivo.dataAquisicao
                            },
                            'garantia': ativoTangivel.garantia,
                            'taxaDepreciacao': ativoTangivel.taxaDepreciacao,
                            'periodoDepreciacao': ativoTangivel.periodoDepreciacao
                        })
                    });
                    if (response.ok) {
                        console.log('Ativo atualizado com sucesso!');
                    } else {
                        console.error('Erro ao atualizar o ativo:', response.statusText);
                    }
                } else {
                    const respIntangivel = await fetch(`http://localhost:8080/ativoIntangivel/atualizacao/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            'id': id,
                            'ativo': {
                                'id': id,
                                'nome': formAtivo.nome,
                                'custoAquisicao': formAtivo.custoAquisicao,
                                'tipo': formAtivo.tipo,
                                'tag': formAtivo.tag,
                                'grauImportancia': formAtivo.importancia,
                                'idResponsavel': { 'id': formAtivo.responsavel.id },
                                'descricao': formAtivo.descricao,
                                'numeroIdentificacao': formAtivo.numeroIdentificacao,
                                'marca': formAtivo.marca,
                                'dataAquisicao': formAtivo.dataAquisicao
                            },
                            'dataExpiracao': ativoIntangivel?.expiracao,
                            'taxaAmortizacao': ativoIntangivel?.taxaAmortizacao,
                            'periodoAmortizacao': ativoIntangivel?.periodoAmortizacao
                        })
                    });
                    if (respIntangivel.ok) {
                        console.log('Ativo atualizado com sucesso!');
                    } else {
                        console.error('Erro ao atualizar o ativo: ', respIntangivel.statusText)
                    }
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
                        <h3 className='nomeAtivo'>{formAtivo.nome}</h3>
                        <div className='dadosGerais'>
                            <div className='linha'>
                                <div className='coluna1'>
                                    <div className='campoInput'>
                                        <label>Data da aquisição</label>
                                        <div className='inputContainer'>
                                            <input className='input' type='date' name='dataAquisicao' defaultValue={formAtivo.dataAquisicao} onChange={handleInputChange}></input>
                                        </div>
                                    </div>
                                    <div className='campoInput'>
                                        <label>Custo da aquisição</label>
                                        <div className='inputContainer'>
                                            <input className='input' type='number' name='custoAquisicao' defaultValue={formAtivo.custoAquisicao} onChange={handleInputChange}></input>
                                        </div>
                                    </div>
                                    <div className='campoInput'>
                                        {ativoTangivel != null ?
                                            <>
                                                <label>Taxa de depreciação</label> {/* tangivel */}
                                                <div className='inputContainer'>
                                                    <input className='input' type='number' name='taxaDepreciacao' defaultValue={ativoTangivel?.taxaDepreciacao} onChange={handleInputChange}></input>
                                                </div>
                                            </> :
                                            <>
                                                <label>Taxa de amortização</label> {/* intangivel */}
                                                <div className='inputContainer'>
                                                    <input className='input' type='number' name='taxaAmortizacao' defaultValue={ativoIntangivel?.taxaAmortizacao} onChange={handleInputChange}></input>
                                                </div>
                                            </>}
                                    </div>
                                </div>
                                <div className='coluna2'>
                                    <div className='campoInput'>
                                        {ativoTangivel != null ?
                                            <>
                                                <label>Período de depreciação</label> {/* tangivel */}
                                                <div className='inputContainer'>
                                                    <input className='input' type='text' name='periodoDepreciacao' defaultValue={ativoTangivel?.periodoDepreciacao} onChange={handleInputChange}></input>
                                                </div>
                                            </> :
                                            <>
                                                <label>Período de amortização</label> {/* intangivel */}
                                                <div className='inputContainer'>
                                                    <input className='input' type='text' name='periodoDepreciacao' defaultValue={ativoIntangivel?.periodoAmortizacao} onChange={handleInputChange}></input>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div className='campoInput'>
                                        {ativoTangivel != null ?
                                            <>
                                                <label>Data da garantia</label>
                                                <div className='inputContainer'>
                                                    <input className='input' type='date' name='validade' defaultValue={ativoTangivel?.garantia} onChange={handleInputChange}></input>
                                                </div>
                                            </> :
                                            <>
                                                <label>Data de expiração</label>
                                                <div className='inputContainer'>
                                                    <input className='input' type='date' name='validade' defaultValue={ativoIntangivel?.expiracao} onChange={handleInputChange}></input>
                                                </div>
                                            </>}

                                    </div>
                                    <div className='campoInput'>
                                        <label>Marca</label>
                                        <div className='inputContainer'>
                                            <input className='input' type='text' name='marca' defaultValue={formAtivo.marca} onChange={handleInputChange}></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='descricao'>
                                <label>Descrição</label>
                                <div className='inputContainer'>
                                    <textarea className='descricaoText' name='descricao' defaultValue={formAtivo.descricao} onChange={handleInputChange}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='ladoDireito'>
                        <div className='superiorDireito'>
                            <div className='linha'>
                                <div className='campoInput'>
                                    <label>Categoria</label>
                                    <div className='inputContainer'>
                                        <input className='input' type='text' name='tipo' defaultValue={formAtivo.tipo} onChange={handleInputChange}></input>
                                    </div>
                                </div>
                                <div className='campoInput'>
                                    <label>Grau de importância</label>
                                    <div className='inputContainer'>
                                        <select className='input' name='grauImportancia' defaultValue={formAtivo.importancia} onChange={handleInputChange}>
                                            <option value={''}>Selecione nova importância</option>
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
                                        <input className='input' name='tag' defaultValue={formAtivo.tag} onChange={handleInputChange}></input>
                                    </div>
                                </div>
                                <div className='campoInput'>
                                    <label>Status</label>
                                    <div className='inputContainer'>
                                        <input className='input' name='status' defaultValue={statusA} readOnly></input>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='inferiorDireito'>
                            <div className='coluna'>
                                <div className='campoInput'>
                                    <label>Responsável</label>
                                    <div className='inputContainer'>
                                        <select className='input' name='responsavel' value={formAtivo.responsavel.nome} onChange={handleUserChange}>
                                            <option value={''}>Selecione responsável</option>
                                            {usuarios.map(usuario => (
                                                <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='campoInput'>
                                    <label>Departamento</label>
                                    <div className='inputContainer'>
                                        <select className='input' name='departamento' value={selectedUser?.departamento || ''} onChange={handleInputChange}>
                                            <option value={''}>Selecione departamento</option>
                                            <option value={'Departamento 1'}>Departamento 1</option>
                                            <option value={'Departamento 2'}>Departamento 2</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='campoInput'>
                                    <label>Localização</label>
                                    <div className='inputContainer'>
                                        <input className='input' name='localizacao' defaultValue={localAtivo()} readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className='botoes'>
                                <Link className='button' to={`/HistoricoManutencao/${id}`}>Histórico Manutenção</Link>
                                <button className='button' onClick={toggleModal}>Adicionar pedido de manutenção</button>
                                <button id='btnSubmit' className='button' type="submit" onClick={handleSubmit}>Atualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal open={showManutencaoModal} onClose={handleManutencaoSubmit} onCancel={handleCancel} title="Pedido de manutenção">
                    <div>
                        <div className="containerModal">
                            <div className='modal-man'>
                                <h3>Local</h3>
                                <input name="localizacao" value={manutencaoData.localizacao} onChange={handleManutencaoDataChange} />
                            </div>
                            <div className='modal-man'>
                                <h3>Custo</h3>
                                <input name="custo" value={manutencaoData.custo} onChange={handleManutencaoDataChange} />
                            </div>
                        </div>
                        <div className="containerModal">
                            <div className='modal-man'>
                                <h3>Data de envio</h3>
                                <input type="date" name="dataInicio" value={manutencaoData.dataInicio} onChange={handleManutencaoDataChange} />
                            </div>
                            <div className='modal-man'>
                                <h3>Data de retorno</h3>
                                <input type="date" name="dataFim" value={manutencaoData.dataFim} onChange={handleManutencaoDataChange} />
                            </div>
                        </div>
                        <div className="containerModal">
                            <div className='modal-man'>
                                <h3>Descrição</h3>
                                <textarea className="textarea-description" name="descricao" value={manutencaoData.descricao} onChange={handleTextareaDataChange} maxLength={100} />
                            </div>
                            <div className='modal-man'>
                                <h3>Tipo</h3>
                                <select name="tipo" value={reverseTipoMapping[Number(manutencaoData.tipo)]} onChange={handleSelectDataChange}>
                                    <option value="">Selecione</option>
                                    <option value="Preventiva">Preventiva</option>
                                    <option value="Corretiva">Corretiva</option>
                                    <option value="Preditiva">Preditiva</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }