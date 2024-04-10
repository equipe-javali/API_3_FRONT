import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BaseLateralHeader from './pages/BaseLateralHeader';
import VisualizarUsuario from './pages/VisualizarUsuario';
import './App.css';
import CadastroAtivos from './pages/cadastroAtivos';
import DashboardAtivos from './pages/dashboardAtivos';
import CriarUsuario from './pages/CriarUsuario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLateralHeader />}>
          <Route index element={<VisualizarUsuario />} />
          <Route path="/CadastroAtivos" element={<CadastroAtivos />} />
          <Route path="/CadastroUsuario" element={<CriarUsuario />} />
          <Route path="/ativos" element={< DashboardAtivos />} />
          {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
          <Route path="*" element={<CadastroAtivos />} />
        </Route>
      </Routes >
    </BrowserRouter >
  );
}

export default App;