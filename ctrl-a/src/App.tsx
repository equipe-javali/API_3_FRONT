import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastroAtivos from './pages/cadastroAtivos';
import DashboardAtivos from './pages/dashboardAtivos';
import CriarUsuario from './pages/CriarUsuario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastroAtivos/>} />
        <Route path="/CadastroAtivos" element={<CadastroAtivos/>} />
        <Route path="/CadastroUsuario" element={<CriarUsuario/>} />
        <Route path="/funcionario" element={<CadastroAtivos/>}>
          <Route index element={<CadastroAtivos/>} />
          <Route path="example" element={<CadastroAtivos/>} />
        </Route>
        {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
        <Route path="*" element={<CadastroAtivos/>} />
        <Route path="/ativos" element={ < DashboardAtivos /> } />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
