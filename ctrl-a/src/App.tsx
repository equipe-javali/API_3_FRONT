import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import BaseLateralHeader from './pages/BaseLateralHeader';
import DashboardAtivos from './pages/dashboardAtivos';
import VisualizarUsuario from './pages/VisualizarUsuario';
import CadastroAtivos from './pages/cadastroAtivos';
import CriarUsuario from './pages/criarUsuario';
import AtualizarAtivo from './pages/atualizarAtivos';
import HistoricoManutencao from './pages/historicoManutencaoAtivo';



export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        
      <Route index element={<Home />} />
        <Route element={<BaseLateralHeader />}>
          
          <Route path="/ListaAtivos" element={< DashboardAtivos />} />
          <Route path="/ListaUsuarios" element={< VisualizarUsuario />} />
          <Route path="/CadastroAtivo" element={< CadastroAtivos />} />
          <Route path="/CadastroUsuario" element={< CriarUsuario />} />
          <Route path="/HistoricoManutencao/:id_ativo" element={< HistoricoManutencao />} />
          <Route path="/AtualizarAtivo/:id" element={< AtualizarAtivo />} />
          {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
          <Route path="*" element={<Home />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
