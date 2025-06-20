// src/features/pessoas/components/PessoaList.tsx

import React from 'react';
import { useGetAllPessoas, useDeletePessoa } from '../hooks/usePessoaData';
import PessoaForm from './PessoaForm'; // Importa o formulário de criação
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

const PessoaList: React.FC = () => {
  const { data: pessoas, isLoading, isError, error } = useGetAllPessoas();
  const deleteMutation = useDeletePessoa();

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      await deleteMutation.mutateAsync(id);
      // O alert de sucesso já está no hook useDeletePessoa
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Gerenciar Pessoas</h2>

      <div className="mb-8">
        <PessoaForm /> {/* Inclui o formulário de cadastro */}
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Pessoas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-center text-gray-600 dark:text-gray-300">Carregando pessoas...</p>}
          {isError && <p className="text-center text-red-600 dark:text-red-400">Erro ao carregar pessoas: {error.message}</p>}

          {!isLoading && !isError && pessoas && pessoas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:hover:bg-gray-700">
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Chave Pix</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pessoas.map((pessoa) => (
                    <TableRow key={pessoa.id} className="dark:hover:bg-gray-750">
                      <TableCell className="font-medium">{pessoa.id}</TableCell>
                      <TableCell>{pessoa.nome}</TableCell>
                      <TableCell>{pessoa.email}</TableCell>
                      <TableCell>{pessoa.telefone}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pessoa.tipoPessoa === 'DEVEDOR'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                          }`}
                        >
                          {pessoa.tipoPessoa}
                        </span>
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]">
                        {pessoa.chavePix || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {/* Você pode adicionar um botão de editar aqui que leve para uma rota de edição */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(pessoa.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            !isLoading && !isError && <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">Nenhuma pessoa cadastrada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PessoaList;