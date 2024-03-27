import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Keep from './pages/keep';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ < Keep /> } />
        {/* <Route path="/example/com" element={ } />
        <Route path="/example/com" element={ } />
        <Route path="/funcionario" element={ }>
          <Route index element={ } />
          <Route path="example" element={ } />
        </Route> */}
        {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
        <Route path="*" element={ < Keep /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
