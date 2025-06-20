// src/pages/Dashboard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Visão Geral do Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Parcelas */}
        <Card>
          <CardHeader>
            <CardTitle>Parcelas Pendentes</CardTitle>
            <CardDescription>Resumo das parcelas que precisam de atenção.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p> {/* Dados dinâmicos aqui */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Próxima vence em: 25/06/2025</p>
          </CardContent>
        </Card>

        {/* Card de Notificações Enviadas */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações Enviadas Hoje</CardTitle>
            <CardDescription>Total de notificações despachadas nas últimas 24h.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">87</p> {/* Dados dinâmicos aqui */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Taxa de sucesso: 95%</p>
          </CardContent>
        </Card>

        {/* Card de Usuários Ativos */}
        <Card>
          <CardHeader>
            <CardTitle>Pessoas Cadastradas</CardTitle>
            <CardDescription>Número total de usuários na plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">245</p> {/* Dados dinâmicos aqui */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Novos hoje: 3</p>
          </CardContent>
        </Card>
      </div>
      {/* Você pode adicionar mais seções e gráficos aqui */}
    </div>
  );
};

export default Dashboard;