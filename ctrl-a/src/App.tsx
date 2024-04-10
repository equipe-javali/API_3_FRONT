import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastroAtivos from './pages/cadastroAtivos';
import DashboardAtivos from './pages/dashboardAtivos';
import VisualizarUsuario from './pages/VisualizarUsuario';
import BaseLateralHeader from './pages/BaseLateralHeader';
import CriarUsuario from './pages/criarUsuario';


function App(): JSX.Element {
  return (

    <BrowserRouter>
      <Routes>        
        <Route element={<BaseLateralHeader/>}>
          <Route index element={<CadastroAtivos/>} />
          <Route path="/ListaAtivos" element={ < DashboardAtivos /> } />
          <Route path="/ListaUsuarios" element={ < VisualizarUsuario /> } />   
          <Route path="/CadastroAtivo" element={ < CadastroAtivos/> } />   
          <Route path="/CadastroUsuario" element={ < CriarUsuario /> } />     
        </Route>
        
        {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
        <Route path="*" element={<CadastroAtivos/>} />
        {/* <Route path="*" element={ < DashboardAtv /> } /> */}
      </Routes>
    </BrowserRouter>

    
  );
}


export default App;