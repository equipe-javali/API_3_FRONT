import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BaseLateralHeader from './pages/BaseLateralHeader';
import './App.css';
import CadastroAtivos from './pages/cadastroAtivos';
import DashboardAtivos from './pages/dashboardAtivos';
import CriarUsuario from './pages/criarUsuario';
import VisualizarUsuario from './pages/VisualizarUsuario';
import HistoricoManutencao from './pages/historicoManutencaoAtivo';
import Home from './pages/home';


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
          <Route path="/HistoricoManutencao" element={< HistoricoManutencao />} />
          {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
