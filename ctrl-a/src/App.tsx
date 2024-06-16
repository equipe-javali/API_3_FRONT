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
import VisualizarHistorico from './pages/VisualizarHistorico'
import AtualizarUsuario from './pages/atualizarUsuario';
import ManualUsuario from './pages/manualUsuario';
import AlterarSenha from './pages/alterarSenha';
import EsqueciSenha from './pages/esqueciSenha';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/CadastroUsuarioAdm" element={<CriarUsuarioAdm />} />
        <Route path="/RedefinirSenha" element={<EsqueciSenha />} />
        <Route element={<BaseLateralHeader />}>
          <Route path="/ListaAtivos" element={<DashboardAtivos />} />
          <Route path="/ListaUsuarios" element={<VisualizarUsuario />} />
          <Route path="/CadastroAtivo" element={<CadastroAtivos />} />
          <Route path="/AlterarSenha" element={<AlterarSenha />} />
          <Route path="/CadastroUsuario" element={<CriarUsuario />} />
          <Route path="/HistoricoManutencao/:id_ativo" element={<HistoricoManutencao />} />
          <Route path="/AtualizarAtivo/:id" element={< AtualizarAtivo />} />
          <Route path="/EdicaoUsuario/:id" element={< AtualizarUsuario />} />
          <Route path="/Historico/:id" element={< VisualizarHistorico />} />
          <Route path="/Manual" element={< ManualUsuario/>} />
          <Route path="*" element={<DashboardAtivos />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}