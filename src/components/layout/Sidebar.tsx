// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils'; // Para usar classes condicionais do Shadcn/Tailwind

// Se precisar de ícones, adicione aqui (ex: npx shadcn-ui@latest add lucide-react)
// import { HomeIcon, UsersIcon, PackageIcon, MailIcon, BellIcon } from 'lucide-react';

interface SidebarProps {
  // Você pode passar o estado de 'aberto/fechado' se o sidebar for colapsável
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => { // Assume aberto por padrão
  const navLinks = [
    { to: '/', label: 'Dashboard', /* icon: HomeIcon */ },
    { to: '/pessoas', label: 'Pessoas', /* icon: UsersIcon */ },
    { to: '/parcelas', label: 'Parcelas', /* icon: PackageIcon */ },
    { to: '/mensagens', label: 'Mensagens', /* icon: MailIcon */ },
    { to: '/notificacoes', label: 'Notificações', /* icon: BellIcon */ },
  ];

  return (
    <aside
      className={cn(
        "bg-gray-800 text-white w-64 p-4 flex flex-col transition-all duration-300 ease-in-out",
        "dark:bg-gray-900",
        // Adicione classes para esconder/mostrar se for colapsável
        // isOpen ? 'w-64' : 'w-0 overflow-hidden'
      )}
    >
      <nav className="mt-4">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors dark:hover:bg-blue-800"
              >
                {/* {link.icon && <link.icon className="h-5 w-5 mr-3" />} */}
                <span className="font-medium">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;