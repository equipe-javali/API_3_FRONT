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
        departamento: ''
    });
    const [departamento, setDepartamento] = useState('');

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
        const value = e.target.value;
        const name = e.target.name;
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
                console.log('User updated successfully');
                console.log(formData)

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
                            <select className='input' name='permissao' onChange={handleChange}>
                                <option value="">Selecione nova permissão</option>
                                <option value="Usuario">Usuário</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                    </div>
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