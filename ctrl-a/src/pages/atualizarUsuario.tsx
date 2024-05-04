import iconEditar from '../assets/icons/editar.png'
import iconUser from '../assets/icons/visualizar_usuario.png'
import React, { FormEvent, useEffect, useState } from 'react';
import './css/atualizaUsuario.css'
import { useParams } from 'react-router-dom';
import RespostaSistema from '../components/respostaSistema';
import { response } from 'express';

interface UsuarioData {
    nome: string;
    cpf: string;
    nascimento: string;
    telefone: string;
    email: string;
    permissao: string; //'Usuario' ou 'Administrador'
    departamento: string;
    usuariologin: { // null para 'Usuario' e contém informações para 'Administrador'
        id: number;
        senha: string;
    } | null;
}

export default function AtualizarUsuario() {
    const { id } = useParams<{ id: string }>()
    const [editable, setEditable] = useState(false);
    const [formData, setFormData] = useState<UsuarioData>({
        nome: '',
        cpf: '',
        nascimento: '',
        telefone: '',
        email: '',
        departamento: '',
        permissao: '',
        usuariologin: null
    });
    const [senhaInput, setSenhaInput] = useState(false);

    const [textoResposta, setTextoResposta] = useState('')
    const [tipoResposta, setTipoResposta] = useState('')
    function fechaPopUp() {
        setTextoResposta('')
        setTipoResposta('')
    }
    useEffect(() => {
        if (tipoResposta === "Sucesso") {
            const timer = setTimeout(() => {
                fechaPopUp();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [tipoResposta]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/usuario/listagem/${id}`);
            if (response.ok) {
                const userData: UsuarioData = await response.json();
                const permissao = userData.usuariologin ? 'Administrador' : 'Usuario';
                if (permissao == 'Usuario') {
                    setSenhaInput(false)
                } else {
                    setSenhaInput(true)
                }
                setFormData({ ...userData, permissao });
            } else {
                console.error('Failed to fetch user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleIconClick = () => {
        setEditable(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        const name = e.target.name;

        if (name === 'permissao') {
            if (value === 'Usuario') {
                setSenhaInput(false);
                setFormData({ ...formData, usuariologin: null });
            } else {
                setSenhaInput(true);
            }
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            usuariologin: { ...formData.usuariologin!, senha: value }
        });
    };

    const excluirUsuarioLogin = async () => {
        try {
            const excluir = await fetch(`http://localhost:8080/usuarioLogin/exclusao/${id}`, {
                method: 'DELETE'
            });
            if (excluir.ok) {
                console.log('Login excluído com sucesso!');
            } else {
                console.error('Falha ao excluir login:', excluir.statusText);
            }
        } catch (err) {
            console.error('Erro ao excluir login: ', err)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            let usuariologinData = null;
            if (formData.permissao === 'Administrador') {
                usuariologinData = {
                    senha: formData.usuariologin?.senha || null
                };
                const respLogin = await fetch(`http://localhost:8080/usuarioLogin/atualizacao/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'usuario': {'id': id},
                        'senha': usuariologinData
                    })
                });
                if (respLogin.ok){
                    console.log('Senha alterada com sucesso')
                    console.log(respLogin)
                }
            }

            const permissaoAnterior = formData.permissao;
            const response = await fetch(`http://localhost:8080/usuario/atualizacao/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'nome': formData.nome,
                    'cpf': formData.cpf,
                    'nascimento': formData.nascimento,
                    'departamento': formData.departamento,
                    'telefone': formData.telefone,
                    'email': formData.email
                })
            });
            if (response.ok) {
                if (permissaoAnterior === 'Administrador' && formData.permissao === 'Usuario') {
                    await excluirUsuarioLogin();
                }
                setTextoResposta("Usuário alterado com sucesso!")
                setTipoResposta("Sucesso")
                console.log(formData)
            }
            else {
                setTextoResposta(`Não foi possível atualizar! Erro:${response.status}`)
                setTipoResposta("Erro")
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }


    return (
        <>
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <div className="primeiroBloco">
                <div className='inputsPrimeiroBloco'>
                    <div className='inputsFileira'>
                        <div className='nomeUsuario'>
                            <label>Nome</label>
                            <div className="inputContainer">
                                <input className='input' type="text" name='nome' defaultValue={formData.nome} onChange={handleChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                        <div className='cpfUsuario'>
                            <label>CPF</label>
                            <div className="inputContainer">
                                <input className='input' type="text" name='cpf' defaultValue={formData.cpf} readOnly={!editable} onChange={handleChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                    </div>
                    <div className='inputsFileira'>
                        <div className='nascimentoUsuario'>
                            <label>Data de nascimento</label>
                            <div className="inputContainer">
                                <input className='input' type="text" name='nascimento' defaultValue={formData.nascimento} readOnly={!editable} onChange={handleChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                        <div className='telefoneUsuario'>
                            <label>Telefone</label>
                            <div className="inputContainer">
                                <input className='input' type="text" name='telefone' defaultValue={formData.telefone} readOnly={!editable} onChange={handleChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fotoUsuario">
                    <img src={iconUser} />
                </div>
            </div>

            <div className="segundoBloco">
                <div className='inputsFileira'>
                    <div className='emailUsuario'>
                        <label>Email</label>
                        <div className="inputContainer">
                            <input className='input' type="text" name='email' defaultValue={formData.email} readOnly={!editable} onChange={handleChange} />
                            <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                        </div>
                    </div>

                    <div className='permissaoUsuario'>
                        <label>Permissão</label>
                        <div className="inputContainer">
                            <select className='input' name='permissao' value={formData.permissao} onChange={handleChange}>
                                <option value="">Selecione nova permissão</option>
                                <option value="Usuario">Usuário</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                    </div>

                    {senhaInput && (
                        <div className='senhaUsuario'>
                            <label>Senha</label>
                            <div className='inputContainer'>
                                <input className='input' type="password" name="senha" defaultValue={formData.usuariologin?.senha || ''} onChange={handleSenhaChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                    )}

                    <div className='deptoUsuario'>
                        <label>Departamento</label>
                        <div className="inputContainer">
                            <select className='input' name='departamento' value={formData.departamento} onChange={handleChange}>
                                <option value="" >Selecione novo departamento</option>
                                <option value="Departamento 1">Departamento 1</option>
                                <option value="Departamento 2">Departamento 2</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type='button' className='buttonAtualizar' onClick={handleSubmit}>Atualizar</button>
            </div>
        </>
    )
}