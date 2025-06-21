// src/routes/index.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ParcelaList from '../pages/ParcelaList';
import PessoaList from '../features/pessoas/components/PessoaList';
import Notificacoes from '../pages/Notificacoes';
import MensagemList from '../pages/MensagemList'; // Caminho corrigido
// Importe o novo DashboardLayout
import DashboardLayout from '../components/layout/DashboardLayout';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* Envolve todas as rotas com o DashboardLayout */}
      <Routes>
        <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/pessoas" element={<DashboardLayout><PessoaList /></DashboardLayout>} />
        <Route path="/parcelas" element={<DashboardLayout><ParcelaList /></DashboardLayout>} />
        <Route path="/notificacoes" element={<DashboardLayout><Notificacoes /></DashboardLayout>}/>
        <Route path="/mensagens" element={<DashboardLayout><MensagemList/></DashboardLayout>}/>
        {/* Adicione outras rotas aqui, sempre envolvendo com DashboardLayout */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;