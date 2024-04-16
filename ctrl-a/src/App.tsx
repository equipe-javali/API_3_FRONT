import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BaseLateralHeader from './pages/BaseLateralHeader';
import './App.css';
import CadastroAtivos from './pages/cadastroAtivos';
import DashboardAtivos from './pages/dashboardAtivos';
import CriarUsuario from './pages/criarUsuario';
import VisualizarUsuario from './pages/VisualizarUsuario';
import HistoricoManutencao from './pages/historicoManutencaoAtivo';


export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route element={<BaseLateralHeader />}>
          <Route index element={<HistoricoManutencao/>} />
          <Route path="/ListaAtivos" element={< DashboardAtivos />} />
          <Route path="/ListaUsuarios" element={< VisualizarUsuario />} />
          <Route path="/CadastroAtivo" element={< CadastroAtivos />} />
          <Route path="/CadastroUsuario" element={< CriarUsuario />} />
          <Route path="/HistoricoManutencao" element={< HistoricoManutencao />} />
          {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
          <Route path="*" element={<CadastroAtivos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
