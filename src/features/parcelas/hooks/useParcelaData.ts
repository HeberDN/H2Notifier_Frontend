// src/features/parcelas/hooks/useParcelaData.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parcelaService } from '../../../services/parcelaService';
import { Parcela, ParcelaInput } from '../../../types/Parcela';
import { ApiResponse } from 'types/Pessoa';

// Hook para buscar TODAS as parcelas
export const useGetAllParcelas = () => {
  return useQuery<Parcela[], Error>({
    queryKey: ['parcelas'],
    queryFn: async () => {
      const response = await parcelaService.getAllParcelas();
      if (!response.success) {
        throw new Error(response.message || 'Falha ao buscar todas as parcelas.');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // Considera fresh por 1 minuto
    gcTime: 5 * 60 * 1000, // Mantém no cache por 5 minutos
  });
};

// Hook para buscar parcelas por data de vencimento (já tínhamos)
export const useGetParcelasByVencimento = (dataVencimento: string) => {
  return useQuery<Parcela[], Error>({
    queryKey: ['parcelasByVencimento', dataVencimento],
    queryFn: async () => {
      const response = await parcelaService.getParcelasByVencimento(dataVencimento);
      if (!response.success) {
        throw new Error(response.message || 'Falha ao buscar parcelas por vencimento.');
      }
      return response.data;
    },
    enabled: !!dataVencimento,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook para buscar parcelas vencidas
export const useGetParcelasVencidas = () => {
  return useQuery<Parcela[], Error>({
    queryKey: ['parcelasVencidas'],
    queryFn: async () => {
      const response = await parcelaService.getParcelasVencidas();
      if (!response.success) {
        throw new Error(response.message || 'Falha ao buscar parcelas vencidas.');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook para buscar parcela por ID
export const useGetParcelaById = (id: number) => {
  return useQuery<Parcela, Error>({
    queryKey: ['parcela', id],
    queryFn: async () => {
      const response = await parcelaService.getParcelaById(id);
      if (!response.success) {
        throw new Error(response.message || `Falha ao buscar parcela com ID ${id}.`);
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook para buscar parcelas por ID do Cobrador
export const useGetParcelasByCobradorId = (cobradorId: number) => {
  return useQuery<Parcela[], Error>({
    queryKey: ['parcelasByCobrador', cobradorId],
    queryFn: async () => {
      const response = await parcelaService.getParcelasByCobradorId(cobradorId);
      if (!response.success) {
        throw new Error(response.message || `Falha ao buscar parcelas para o cobrador ${cobradorId}.`);
      }
      return response.data;
    },
    enabled: !!cobradorId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook para buscar parcelas por ID do Devedor
export const useGetParcelasByDevedorId = (devedorId: number) => {
  return useQuery<Parcela[], Error>({
    queryKey: ['parcelasByDevedor', devedorId],
    queryFn: async () => {
      const response = await parcelaService.getParcelasByDevedorId(devedorId);
      if (!response.success) {
        throw new Error(response.message || `Falha ao buscar parcelas para o devedor ${devedorId}.`);
      }
      return response.data;
    },
    enabled: !!devedorId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook para calcular o total a receber para um cobrador específico (já tínhamos)
export const useGetTotalAReceber = (cobradorId: number) => {
  return useQuery<number, Error>({
    queryKey: ['totalAReceber', cobradorId],
    queryFn: async () => {
      const response = await parcelaService.getTotalAReceber(cobradorId);
      if (!response.success) {
        throw new Error(response.message || `Falha ao calcular total a receber para o cobrador ${cobradorId}.`);
      }
      return response.data;
    },
    enabled: !!cobradorId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook para criar uma nova parcela
export const useCreateParcela = () => {
  const queryClient = useQueryClient();
  return useMutation<Parcela, Error, ParcelaInput>({
    mutationFn: async (data) => {
      const response = await parcelaService.createParcela(data);
      if (!response.success) {
        throw new Error(response.message || 'Falha ao cadastrar parcela.');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalida o cache de todas as listas de parcelas para forçar um re-fetch
      queryClient.invalidateQueries({ queryKey: ['parcelas'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByVencimento'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasVencidas'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByCobrador'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByDevedor'] });
      queryClient.invalidateQueries({ queryKey: ['totalAReceber'] }); // Invalida o total a receber também
    },
  });
};

// Hook para atualizar uma parcela existente
export const useUpdateParcela = () => {
  const queryClient = useQueryClient();
  return useMutation<Parcela, Error, { id: number; data: ParcelaInput }>({
    mutationFn: async ({ id, data }) => {
      const response = await parcelaService.updateParcela(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Falha ao atualizar parcela.');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalida o cache da parcela específica e de todas as listas
      queryClient.invalidateQueries({ queryKey: ['parcela', data.id] });
      queryClient.invalidateQueries({ queryKey: ['parcelas'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByVencimento'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasVencidas'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByCobrador'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByDevedor'] });
      queryClient.invalidateQueries({ queryKey: ['totalAReceber'] });
    },
  });
};

// Hook para quitar uma parcela
export const useQuitarParcela = () => {
  const queryClient = useQueryClient();
  return useMutation<Parcela, Error, number>({
    mutationFn: async (id) => {
      const response = await parcelaService.quitarParcela(id);
      if (!response.success) {
        throw new Error(response.message || `Falha ao quitar parcela com ID ${id}.`);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['parcela', data.id] });
      queryClient.invalidateQueries({ queryKey: ['parcelas'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByVencimento'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasVencidas'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByCobrador'] });
      queryClient.invalidateQueries({ queryKey: ['parcelasByDevedor'] });
      queryClient.invalidateQueries({ queryKey: ['totalAReceber'] });
    },
  });
};

// Hook para deletar uma parcela
export const useDeleteParcela = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, Error, number>({
    mutationFn: async (id) => {
      const response = await parcelaService.deleteParcela(id);
      if (!response.success) {
        throw new Error(response.message || `Falha ao deletar parcela com ID ${id}.`);
      }
      return response; // A API retorna ApiResponse<null>
    },
    onSuccess: (response, id) => {
      // Remove a parcela deletada do cache de todas as queries
      queryClient.setQueryData<Parcela[]>(['parcelas'], (old) => old?.filter((p) => p.id !== id));
      queryClient.setQueryData<Parcela[]>(['parcelasByVencimento'], (old) => old?.filter((p) => p.id !== id));
      queryClient.setQueryData<Parcela[]>(['parcelasVencidas'], (old) => old?.filter((p) => p.id !== id));
      queryClient.setQueryData<Parcela[]>(['parcelasByCobrador'], (old) => old?.filter((p) => p.id !== id));
      queryClient.setQueryData<Parcela[]>(['parcelasByDevedor'], (old) => old?.filter((p) => p.id !== id));
      queryClient.removeQueries({ queryKey: ['parcela', id] }); // Remove a query da parcela específica
      queryClient.invalidateQueries({ queryKey: ['totalAReceber'] }); // Invalida o total a receber
    },
  });
};