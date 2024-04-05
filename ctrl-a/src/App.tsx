import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastroAtivos from './pages/cadastroAtivos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastroAtivos/>} />
        <Route path="/CadastroAtivos" element={<CadastroAtivos/>} />
        <Route path="/funcionario" element={<CadastroAtivos/>}>
          <Route index element={<CadastroAtivos/>} />
          <Route path="example" element={<CadastroAtivos/>} />
        </Route>
        {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
        <Route path="*" element={<CadastroAtivos/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
