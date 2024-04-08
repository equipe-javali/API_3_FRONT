import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardAtivos from './pages/dashboardAtivos';
import VisualizarUsuario from './pages/visualizarUsuario';


function App(): JSX.Element {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/ativos" element={ < DashboardAtivos /> } />
        <Route path="/ListaUsuarios" element={ < VisualizarUsuario /> } />
        {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
        {/* <Route path="*" element={ < DashboardAtv /> } /> */}
      </Routes>
    </BrowserRouter>

    
  );
}


export default App;