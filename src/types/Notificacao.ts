// src/types/Notificacao.ts

// Os canais de notificação disponíveis
export type CanalNotificacao = "WHATSAPP" | "EMAIL" ; // Adicione SMS se seu backend suportar

// Estrutura do corpo da requisição para enviar ou pré-visualizar notificações
export interface NotificacaoInput {
  idParcela: number;
  canais: CanalNotificacao[];
}

// Resposta da API para o envio de notificações (data é null)
export interface NotificacaoEnvioResponse {
  success: boolean;
  message: string;
  data: null;
}

// Resposta da API para o preview de notificações (data é uma string HTML)
export interface NotificacaoPreviewResponse {
  success: boolean;
  message: string;
  data: string; // Conteúdo HTML do preview
}