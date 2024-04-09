import React from 'react';
import { BrowserRouter,   Route, Routes } from 'react-router-dom';
import BaseLateralHeader from './pages/BaseLateralHeader';
import VisualizarUsuario from './pages/VisualizarUsuario';
import './App.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLateralHeader />}>
          <Route index element={<VisualizarUsuario />} />
        </Route>
      </Routes>
    </BrowserRouter>      
  );
}


export default App;