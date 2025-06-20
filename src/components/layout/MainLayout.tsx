// src/components/layout/MainLayout.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importe o Link aqui
import ThemeToggle from '../common/ThemeToggle'; // Seu ThemeToggle

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 dark:text-gray-50">
      <header className="bg-blue-600 text-white p-4 text-center flex justify-between items-center dark:bg-blue-900">
        <h1 className="text-2xl font-bold">H2Notifier</h1>
        <nav className="flex-grow flex justify-center">
          <ul className="flex space-x-6 text-lg">
            <li>
              <Link to="/" className="hover:text-blue-200 transition-colors">Dashboard</Link>
            </li>
            <li>
              <Link to="/pessoas" className="hover:text-blue-200 transition-colors">Pessoas</Link>
            </li>
            <li>
              <Link to="/parcelas" className="hover:text-blue-200 transition-colors">Parcelas</Link>
            </li>
            <li>
              <Link to="/notificacoes" className="hover:text-blue-200 transition-colors">Notificacoes</Link>
            </li>
            {/* Adicione outros links aqui */}
          </ul>
        </nav>
        <ThemeToggle />
      </header>

      <main className="flex-grow p-4">
        {children} {/* Aqui as rotas filhas serão renderizadas */}
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center dark:bg-gray-950">
        <p>&copy; {new Date().getFullYear()} H2Notifier. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default MainLayout;