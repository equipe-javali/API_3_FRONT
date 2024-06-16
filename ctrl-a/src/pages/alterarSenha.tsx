import React, { FormEvent, useEffect, useState } from 'react';
import './css/atualizaUsuario.css'
import RespostaSistema from '../components/respostaSistema';
import getLocalToken from '../utils/getLocalToken';
import CampoSenha from '../components/CampoSenha';
import { useParams } from 'react-router-dom';

export default function AtualizarUsuario() {
    const { email: usuarioEmail } = useParams<{ email: string }>();
    const token = getLocalToken();

    const [textoResposta, setTextoResposta] = useState('');
    const [tipoResposta, setTipoResposta] = useState('');

    function fechaPopUp() {
        setTextoResposta('');
        setTipoResposta('');
    }

    const [avisoSenha, setAvisoSenha] = useState<string | undefined>(undefined);
    const campoSenha = CampoSenha(
        "Nova senha:",
        "Insira a nova senha",
        true,
        avisoSenha
    );

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (campoSenha.dado === '') {
            setAvisoSenha("Insira a nova senha");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/esqueciSenha`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                  novaSenha: campoSenha.dado,
                usuario: { email: usuarioEmail }
              })
            });

            if (response.ok) {
                setTextoResposta("Senha atualizada com sucesso!");
                setTipoResposta("Sucesso");
                campoSenha.limpar();
            } else {
                const responseData = await response.json();
                setTextoResposta(`Erro ao atualizar senha: ${responseData.error}`);
                setTipoResposta("Erro");
            }
        } catch (error) {
            setTextoResposta(`Erro ao processar requisição! Erro:${error}`);
            setTipoResposta("Erro");
        }
    }

    return (
        <>
            <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
            <form className='divAtualizarUsuario' onSubmit={handleSubmit}>
                <div>
                    {campoSenha.codigo}
                </div>
                <div>
                    <input type='submit' className='buttonAtualizar' value='Atualizar Senha' /> as JSX.Element
                </div>
            </form>
        </>
    )
}
