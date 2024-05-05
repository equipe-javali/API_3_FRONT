
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import BaseLateralHeader from './pages/BaseLateralHeader';
import DashboardAtivos from './pages/dashboardAtivos';
import VisualizarUsuario from './pages/VisualizarUsuario';
import CadastroAtivos from './pages/cadastroAtivos';
import CriarUsuario from './pages/criarUsuario';
import AtualizarAtivo from './pages/atualizarAtivos';
import CriarUsuarioAdm from './pages/cadastrarAdm';
import Home from './pages/home';
import HistoricoManutencao from './pages/historicoManutencaoAtivo';
import AtualizarUsuario from './pages/atualizarUsuario';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route element={<BaseLateralHeader />}>
          <Route path="/ListaAtivos" element={<DashboardAtivos />} />
          <Route path="/ListaUsuarios" element={<VisualizarUsuario />} />
          <Route path="/CadastroAtivo" element={<CadastroAtivos />} />
          <Route path="/CadastroUsuario" element={<CriarUsuario />} />
          <Route path="/AtualizarAtivo/:id" element={<AtualizarAtivo />} />
          <Route path="/HistoricoManutencao/:id_ativo" element={<HistoricoManutencao />} />
          <Route path="/CadastroUsuarioAdm" element={<CriarUsuarioAdm />} />
          <Route path="/AtualizarAtivo/:id" element={< AtualizarAtivo />} />
          <Route path="/EdicaoUsuario/:id" element={< AtualizarUsuario />} />
          <Route path="*" element={<DashboardAtivos />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}