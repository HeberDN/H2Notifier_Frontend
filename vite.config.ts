import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { // <--- Adicione ou modifique esta seção
    alias: {
      "@": path.resolve(__dirname, "./src"), // <--- Mapeia @ para a pasta src
      "@/lib": path.resolve(__dirname, "./src/lib"), // <--- Mapeia @/lib para src/lib
      "@/components": path.resolve(__dirname, "./src/components"), // <--- Mapeia @/components para src/components
      // Se você tiver mais aliases no tsconfig.json, adicione-os aqui também
    },
  },
});