// src/components/layout/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle'; // Assumindo que ThemeToggle está aqui
import { Button } from '../ui/button'; // Para um botão de menu hamburguer se necessário
import { Bars3Icon } from "@heroicons/react/24/outline";

interface NavbarProps {
  // Se precisar passar algo, como um toggle para o sidebar
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center dark:bg-blue-900 shadow-md">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-4 lg:hidden">
          <Bars3Icon className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">H2Notifier</h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* Aqui você pode adicionar itens de menu globais se não forem para o sidebar */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;