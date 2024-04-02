import React from 'react';
import './css/base.css';
import VisualizarUsuario from './paginas/VisualizarUsuario';
import CriarUsuario from './paginas/CriarUsuario';

function App(): JSX.Element {
  return (
    <div className="App">
      <VisualizarUsuario />
      <CriarUsuario />
    </div>
  );
}


export default App;
