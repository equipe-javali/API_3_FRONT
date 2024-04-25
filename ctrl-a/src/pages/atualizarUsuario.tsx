import iconEditar from '../assets/icons/editar.png'
import iconUser from '../assets/icons/visualizar_usuario.png'
import React, { useState } from 'react';
import './css/atualizaUsuario.css'

export default function AtualizarUsuario() {
    const [editable, setEditable] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleIconClick = () => {
        setEditable(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <>
            <div className="primeiroBloco">
                <div className='inputsPrimeiroBloco'>
                    <div className='inputsFileira'>
                        <div className='nomeUsuario'>
                            <span>Nome</span>
                            <div className="inputContainer">
                                <input className='input' type="text" value={inputValue} readOnly={!editable} onChange={handleInputChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                        <div className='cpfUsuario'>
                            <span>CPF</span>
                            <div className="inputContainer">
                                <input className='input' type="text" value={inputValue} readOnly={!editable} onChange={handleInputChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                    </div>
                    <div className='inputsFileira'>
                        <div className='nascimentoUsuario'>
                            <span>Data de nascimento</span>
                            <div className="inputContainer">
                                <input className='input' type="text" value={inputValue} readOnly={!editable} onChange={handleInputChange} />
                                <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                            </div>
                        </div>
                        <div className='telefoneUsuario'>
                            <span>Telefone</span>
                            <div className="inputContainer">
                                <input className='input' type="text" value={inputValue} readOnly={!editable} onChange={handleInputChange} />
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
                        <span>Email</span>
                        <div className="inputContainer">
                            <input className='input' type="text" value={inputValue} readOnly={!editable} onChange={handleInputChange} />
                            <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                        </div>
                    </div>
                    <div className='permissaoUsuario'>
                        <span>Permissão</span>
                        <div className="inputContainer">
                            <input className='input' type="text" value={inputValue} readOnly={!editable} onChange={handleInputChange} />
                            <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                        </div>
                    </div>
                    <div className='deptoUsuario'>
                        <span>Departamento</span>
                        <div className="inputContainer">
                            <input className='input' type="text" value={inputValue} readOnly={!editable} onChange={handleInputChange} />
                            <img src={iconEditar} id='iconeEditar' onClick={handleIconClick} />
                        </div>
                    </div>
                </div>
                <button type='button' className='buttonAtualizar'>Atualizar</button>
            </div>
        </>
    )
}