// src/services/notificacaoService.ts

import api from './api';
import axios from 'axios';
import { NotificacaoInput, NotificacaoEnvioResponse, NotificacaoPreviewResponse } from '../types/Notificacao';

export const notificacaoService = {
  // POST: Enviar Notificações
  // http://localhost:8080/api/v1/notificacoes/enviar
  enviarNotificacoes: async (data: NotificacaoInput): Promise<NotificacaoEnvioResponse> => {
    try {
      const response = await api.post<NotificacaoEnvioResponse>('/notificacoes/enviar', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao enviar notificações');
      }
      throw new Error('Erro de rede ou desconhecido ao enviar notificações');
    }
  },

  // POST: Preview Notificações
  // http://localhost:8080/api/v1/notificacoes/preview
  previewNotificacoes: async (data: NotificacaoInput): Promise<NotificacaoPreviewResponse> => {
    try {
      const response = await api.post<NotificacaoPreviewResponse>('/notificacoes/preview', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao gerar preview da notificação');
      }
      throw new Error('Erro de rede ou desconhecido ao gerar preview da notificação');
    }
  },
};