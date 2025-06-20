import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  // Estado para controlar o tema atual
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Inicializa o tema baseado no localStorage ou na preferência do sistema
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement; // O elemento <html>

    root.classList.remove('light', 'dark'); // Remove classes existentes
    root.classList.add(theme); // Adiciona a classe do tema atual
    localStorage.setItem('theme', theme); // Salva a preferência no localStorage
  }, [theme]); // Roda quando o tema muda

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {theme === 'light' ? '💡 Modo Claro' : '🌙 Modo Escuro'}
    </button>
  );
};

export default ThemeToggle;