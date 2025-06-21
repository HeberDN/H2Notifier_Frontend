import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MensagemService } from '../../../services/MensagemService';
import { Mensagem, MensagemInput } from '../../../types/Mensagem';
import { PageResponse } from '../../../types/ApiResponses';
import { toast } from 'sonner';

const MESSAGE_QUERY_KEY = 'mensagens';

// READ: Buscar todas as mensagens (com paginação)
export const useGetAllMensagens = (page: number = 0, size: number = 10) => {
  return useQuery<PageResponse<Mensagem>, Error>({
    queryKey: [MESSAGE_QUERY_KEY, page, size],
    queryFn: () => MensagemService.getAllMensagens(page, size),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

// READ: Buscar mensagem por ID
export const useGetMensagemById = (id: number) => {
  return useQuery<Mensagem, Error>({
    queryKey: [MESSAGE_QUERY_KEY, id],
    queryFn: () => MensagemService.getMensagemById(id),
    enabled: !!id, // Só executa a query se o ID for válido
  });
};

// CREATE: Criar nova mensagem
export const useCreateMensagem = () => {
  const queryClient = useQueryClient();
  return useMutation<Mensagem, Error, MensagemInput>({
    mutationFn: MensagemService.createMensagem,
    onSuccess: () => {
      // Invalida o cache de todas as mensagens para que seja recarregado
      queryClient.invalidateQueries({ queryKey: [MESSAGE_QUERY_KEY] });
      toast.success('Mensagem criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar mensagem: ${error.message || 'Erro desconhecido'}`);
    },
  });
};

// UPDATE: Atualizar mensagem existente
export const useUpdateMensagem = () => {
  const queryClient = useQueryClient();
  return useMutation<Mensagem, Error, { id: number; data: MensagemInput }>({
    mutationFn: ({ id, data }) => MensagemService.updateMensagem(id, data),
    onSuccess: (_, variables) => {
      // Invalida o cache de todas as mensagens e da mensagem específica
      queryClient.invalidateQueries({ queryKey: [MESSAGE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MESSAGE_QUERY_KEY, variables.id] });
      toast.success('Mensagem atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar mensagem: ${error.message || 'Erro desconhecido'}`);
    },
  });
};

// DELETE: Deletar mensagem
export const useDeleteMensagem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: MensagemService.deleteMensagem,
    onSuccess: () => {
      // Invalida o cache de todas as mensagens
      queryClient.invalidateQueries({ queryKey: [MESSAGE_QUERY_KEY] });
      toast.success('Mensagem deletada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(`Erro ao deletar mensagem: ${error.message || 'Erro desconhecido'}`);
    },
  });
};