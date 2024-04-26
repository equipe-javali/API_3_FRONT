import iconEditar from '../assets/icons/editar.png'
import iconUser from '../assets/icons/visualizar_usuario.png'
import React, { FormEvent, useState } from 'react';
import './css/atualizaUsuario.css'

export default function AtualizarUsuario() {
    const [editable, setEditable] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [nascimento, setNascimento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [permissao, setPermissao] = useState('');
    const [departamento, setDepartamento] = useState('');

    const handleIconClick = () => {
        setEditable(true);
    };

    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNome(e.target.value);
    };
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(e.target.value);
    };
    const handleNascimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNascimento(e.target.value);
    };
    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTelefone(e.target.value);
    };
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const handlePermissaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPermissao(e.target.value);
    };
    const handleDepartamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDepartamento(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const data = {
            nome,
            cpf,
            nascimento,
            telefone,
            email,
            permissao,
            departamento
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
                                <input className='input' type="text" value={nome} readOnly={!editable} onChange={handleNomeChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                        <div className='cpfUsuario'>
                            <label>CPF</label>
                            <div className="inputContainer">
                                <input className='input' type="text" value={cpf} readOnly={!editable} onChange={handleCpfChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                    </div>
                    <div className='inputsFileira'>
                        <div className='nascimentoUsuario'>
                            <label>Data de nascimento</label>
                            <div className="inputContainer">
                                <input className='input' type="text" value={nascimento} readOnly={!editable} onChange={handleNascimentoChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                        <div className='telefoneUsuario'>
                            <label>Telefone</label>
                            <div className="inputContainer">
                                <input className='input' type="text" value={telefone} readOnly={!editable} onChange={handleTelefoneChange} />
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
                            <input className='input' type="text" value={email} readOnly={!editable} onChange={handleEmailChange} />
                            <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                        </div>
                    </div>
                    <div className='permissaoUsuario'>
                        <label>Permissão</label>
                        <div className="inputContainer">
                            <select className='input' value={permissao} onChange={handlePermissaoChange}>
                                <option value="">Selecione nova permissão</option>
                                <option value="Usuario">Usuário</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                    </div>
                    <div className='deptoUsuario'>
                        <label>Departamento</label>
                        <div className="inputContainer">
                            <select className='input' value={departamento} onChange={handleDepartamentoChange}>
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