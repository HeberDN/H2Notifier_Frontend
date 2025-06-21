// src/components/layout/DashboardLayout.tsx
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // Você pode adicionar estado para controlar o sidebar (ex: colapsar/expandir)
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 dark:text-gray-50">
        <Navbar /* onToggleSidebar={toggleSidebar} */ /> {/* Passa a função de toggle para o Navbar se precisar */}

        <div className="flex flex-1"> {/* Flex container para Sidebar e Conteúdo Principal */}
            <Sidebar /* isOpen={isSidebarOpen} */ /> {/* Passa o estado de abertura para o Sidebar */}

            {/* Área de Conteúdo Principal */}
            <main className="flex-1 p-4 overflow-auto"> {/* flex-1 faz ele ocupar o espaço restante */}
            {children} {/* Aqui é onde o conteúdo da sua página (Dashboard, Mensagens, etc.) será renderizado */}
            </main>
        </div>

        {/* Se você tiver um footer que é global e não parte do conteúdo principal, coloque aqui */}
            <footer className="bg-gray-800 text-white p-4 text-center dark:bg-gray-950">
            <p>&copy; {new Date().getFullYear()} H2Notifier. Todos os direitos reservados.</p>
        </footer>
        </div>
    );
};

export default DashboardLayout;