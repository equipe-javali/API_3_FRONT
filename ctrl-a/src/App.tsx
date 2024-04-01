import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CadastroAtivosTangiveis from './pages/cadastroAtivosTangiveis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CadastroAtivosTangiveis/>} />
        <Route path="/example/com" element={<CadastroAtivosTangiveis/>} />
        <Route path="/example/com" element={<CadastroAtivosTangiveis/>} />
        <Route path="/funcionario" element={<CadastroAtivosTangiveis/>}>
          <Route index element={<CadastroAtivosTangiveis/>} />
          <Route path="example" element={<CadastroAtivosTangiveis/>} />
        </Route>
        {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
        <Route path="*" element={<CadastroAtivosTangiveis/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
