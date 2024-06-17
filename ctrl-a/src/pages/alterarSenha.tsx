import { FormEvent, useEffect, useState } from 'react';
import './css/alterarSenha.css'
import RespostaSistema from '../components/respostaSistema';
import getLocalToken from '../utils/getLocalToken';
import CampoSenha from '../components/CampoSenha';
import { Link } from 'react-router-dom';

export default function AlterarSenha() {
  const [textoResposta, setTextoResposta] = useState('');
  const [tipoResposta, setTipoResposta] = useState('');
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


  const [avisoSenha, setAvisoSenha] = useState<string | undefined>(undefined);
  const [avisoConfirmarSenha, setAvisoConfirmarSenha] = useState<string | undefined>(undefined);
  const campoSenha = CampoSenha(
    "Nova senha:",
    "Insira a nova senha",
    true,
    avisoSenha
  );
  const confirmarSenha = CampoSenha("Confirmar nova senha:", "Confirme a nova senha", true, avisoConfirmarSenha)

  const usuario = localStorage.getItem("usuario")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (campoSenha.dado === '') {
      setAvisoSenha("Insira a nova senha");
      return;
    } else if (confirmarSenha.dado === '') {
      setAvisoConfirmarSenha("Confirme a nova senha")
      return
    } else if (confirmarSenha.dado !== campoSenha.dado) {
      setAvisoSenha("Os dois campos devem ser preenchidos com o mesmo valor");
      setAvisoConfirmarSenha("Os dois campos devem ser preenchidos com o mesmo valor")
      return
    }

    if (usuario !== null) {
      const parseUsuario = JSON.parse(usuario)

      try {
        const response = await fetch(`http://localhost:8080/usuario/esqueciSenha`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getLocalToken()
          },
          body: JSON.stringify({
            usuario: parseUsuario,
            novaSenha: campoSenha.dado,
            ConfNovaSenha: campoSenha.dado
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

  }

  return (
    <div className='AlterarSenha'>
      <RespostaSistema textoResposta={textoResposta} tipoResposta={tipoResposta} onClose={fechaPopUp} />
      <h1 className='titulo'>Alterar Senha</h1>
      <form className='form-alterarSenha' onSubmit={handleSubmit}>
        <Link className="retornarLogin" to={'/'}>◀ Voltar</Link>
        {campoSenha.codigo}
        {confirmarSenha.codigo}
        <input type='submit' className='buttonAtualizar' value='Enviar' />
      </form>
    </div>
  )
}
