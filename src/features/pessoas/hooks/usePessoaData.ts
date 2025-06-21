import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pessoaService } from '../../../services/pessoaService'; // Ajuste o caminho se necessário
import { Pessoa, PessoaInput } from '../../../types/Pessoa';

// Hook para buscar todas as pessoas
export const useGetAllPessoas = () => {
  return useQuery<Pessoa[], Error>({
    queryKey: ['pessoas'], // Chave única para este query
    queryFn: async () => {
      const response = await pessoaService.getAllPessoas();
      if (!response.success) {
        throw new Error(response.message || 'Falha ao buscar pessoas.');
      }
      return response.data;
    },
  });
};

// Hook para buscar uma pessoa por ID
export const useGetPessoaById = (id: number) => {
  return useQuery<Pessoa, Error>({
    queryKey: ['pessoa', id],
    queryFn: async () => {
      const response = await pessoaService.getPessoaById(id);
      if (!response.success) {
        throw new Error(response.message || `Falha ao buscar pessoa com ID ${id}.`);
      }
      return response.data;
    },
    enabled: !!id, // Só executa a query se o ID for válido
  });
};

// Hook para cadastrar uma nova pessoa
export const useCreatePessoa = () => {
  const queryClient = useQueryClient(); // Para invalidar o cache após a criação

  return useMutation<Pessoa, Error, PessoaInput>({
    mutationFn: async (newData: PessoaInput) => {
      const response = await pessoaService.createPessoa(newData);
      if (!response.success) {
        throw new Error(response.message || 'Falha ao cadastrar pessoa.');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] }); // Invalida a lista de pessoas para buscar a nova
      alert('Pessoa cadastrada com sucesso!'); // Feedback ao usuário
    },
    onError: (error) => {
      console.error("Erro ao cadastrar pessoa:", error.message);
      alert(`Erro ao cadastrar pessoa: ${error.message}`);
    },
  });
};

// Hook para atualizar uma pessoa
export const useUpdatePessoa = () => {
  const queryClient = useQueryClient();

  return useMutation<Pessoa, Error, { id: number; data: Partial<PessoaInput> }>({
    mutationFn: async ({ id, data }) => {
      const response = await pessoaService.updatePessoa(id, data);
      if (!response.success) {
        throw new Error(response.message || `Falha ao atualizar pessoa com ID ${id}.`);
      }
      return response.data;
    },
    onSuccess: (updatedPessoa) => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] }); // Invalida a lista
      queryClient.invalidateQueries({ queryKey: ['pessoa', updatedPessoa.id] }); // Invalida o item específico
      alert('Pessoa atualizada com sucesso!');
    },
    onError: (error) => {
      console.error("Erro ao atualizar pessoa:", error.message);
      alert(`Erro ao atualizar pessoa: ${error.message}`);
    },
  });
};

// Hook para excluir uma pessoa
export const useDeletePessoa = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({ // Tipo de retorno 'void' para delete
    mutationFn: async (id: number) => {
      const response = await pessoaService.deletePessoa(id);
      if (!response.success) {
        throw new Error(response.message || `test Falha ao excluir pessoa com ID ${id}.`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] }); // Invalida a lista
      alert('Pessoa excluída com sucesso!');
    },
    onError: (error) => {
      console.error("Erro ao excluir pessoa:", error.message);
      alert(`Erro ao excluir pessoa: ${error.message}`);
    },
  });
};