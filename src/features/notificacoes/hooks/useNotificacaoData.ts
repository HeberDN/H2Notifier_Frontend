// src/features/notificacoes/hooks/useNotificacaoData.ts

import { useMutation } from '@tanstack/react-query';
import { notificacaoService } from '../../../services/notificacaoService';
import { NotificacaoInput, NotificacaoEnvioResponse, NotificacaoPreviewResponse } from '../../../types/Notificacao';

// Hook para enviar notificações
export const useEnviarNotificacoes = () => {
  return useMutation<NotificacaoEnvioResponse, Error, NotificacaoInput>({
    mutationFn: async (data) => {
      const response = await notificacaoService.enviarNotificacoes(data);
      if (!response.success) {
        throw new Error(response.message || 'Falha ao enviar notificações.');
      }
      return response; // A API retorna NotificacaoEnvioResponse
    },
    // Não há invalidateQueries aqui porque o envio de notificação não altera o estado de uma Parcela,
    // apenas gera uma ação. Se houvesse um log de notificações que você quisesse exibir, aí sim.
  });
};

// Hook para pré-visualizar notificações
export const usePreviewNotificacoes = () => {
  return useMutation<NotificacaoPreviewResponse, Error, NotificacaoInput>({
    mutationFn: async (data) => {
      const response = await notificacaoService.previewNotificacoes(data);
      if (!response.success) {
        throw new Error(response.message || 'Falha ao gerar preview da notificação.');
      }
      return response; // A API retorna NotificacaoPreviewResponse
    },
  });
};