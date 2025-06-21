// src/routes/index.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ParcelaList from '../pages/ParcelaList';
import PessoaList from '../features/pessoas/components/PessoaList';
import Notificacoes from '../pages/Notificacoes';
import MainLayout from '../components/layout/MainLayout';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* Envolve todas as rotas com o MainLayout */}
      <Routes>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/pessoas" element={<MainLayout><PessoaList /></MainLayout>} />
        <Route path="/parcelas" element={<MainLayout><ParcelaList /></MainLayout>} />
        <Route path="/notificacoes" element={<MainLayout><Notificacoes /></MainLayout>}/>
        {/* Adicione outras rotas aqui, sempre envolvendo com MainLayout */}
        {/* <Route path="/notificacoes-manuais" element={<MainLayout><NotificacaoManual /></MainLayout>} /> */}
        {/* <Route path="/mensagens-templates" element={<MainLayout><MensagensTemplates /></MainLayout>} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;