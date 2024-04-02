import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardAtv from './pages/dashboardAtv';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ativos" element={ < DashboardAtv /> } />
        {/* path="*" serve para qualquer rota, então deve ficar por último e direcionar para a home ou uma página de erro 404 */}
        {/* <Route path="*" element={ < DashboardAtv /> } /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
