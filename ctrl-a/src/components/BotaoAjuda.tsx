import React from 'react';
import '../components/css/botaoAjuda';

const BotaoFlutuante: React.FC = () => {
  const handleButtonClick = () => {
    window.location.href = '/manualUsuario'; // Redireciona para a página manualUsuario
  };

  return (
    <div className="botao-flutuante" onClick={handleButtonClick}>
      Manual do Usuário
    </div>
  );
};

export default BotaoFlutuante;
