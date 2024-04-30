import iconEditar from '../assets/icons/editar.png'
import iconUser from '../assets/icons/visualizar_usuario.png'
import React, { FormEvent, useEffect, useState } from 'react';
import './css/atualizaUsuario.css'
import { useParams } from 'react-router-dom';

export default function AtualizarUsuario() {
    const { id } = useParams<{id: string}>()
    const [editable, setEditable] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        nascimento: '',
        telefone: '',
        email: '',
        permissao: '',
        departamento: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/usuario/listagem/${id}`);
            if (response.ok) {
                const userData = await response.json();
                setFormData(userData);
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/usuario/atualizacao/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                console.log('User updated successfully');

            } else {
                console.error('Failed to update user:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }


    return (
        <>
            <div className="primeiroBloco">
                <div className='inputsPrimeiroBloco'>
                    <div className='inputsFileira'>
                        <div className='nomeUsuario'>
                            <label>Nome</label>
                            <div className="inputContainer">
                                <input className='input' type="text" value={formData.nome} readOnly={!editable} onChange={handleChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                        <div className='cpfUsuario'>
                            <label>CPF</label>
                            <div className="inputContainer">
                                <input className='input' type="text" value={formData.cpf} readOnly={!editable} onChange={handleChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                    </div>
                    <div className='inputsFileira'>
                        <div className='nascimentoUsuario'>
                            <label>Data de nascimento</label>
                            <div className="inputContainer">
                                <input className='input' type="text" value={formData.nascimento} readOnly={!editable} onChange={handleChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                        <div className='telefoneUsuario'>
                            <label>Telefone</label>
                            <div className="inputContainer">
                                <input className='input' type="text" value={formData.telefone} readOnly={!editable} onChange={handleChange} />
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
                            <input className='input' type="text" value={formData.email} readOnly={!editable} onChange={handleChange} />
                            <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                        </div>
                    </div>
                    <div className='permissaoUsuario'>
                        <label>Permissão</label>
                        <div className="inputContainer">
                            <select className='input' value={formData.permissao} onChange={handleChange}>
                                <option value="">Selecione nova permissão</option>
                                <option value="Usuario">Usuário</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                    </div>
                    <div className='deptoUsuario'>
                        <label>Departamento</label>
                        <div className="inputContainer">
                            <select className='input' value={formData.departamento} onChange={handleChange}>
                                <option value="">Selecione novo departamento</option>
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