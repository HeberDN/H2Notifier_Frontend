export type CanalMensagem = "WHATSAPP" | "EMAIL";

export interface Mensagem {
  id: number;
  titulo: string;
  conteudo: string;
  canal: CanalMensagem;
}

export interface MensagemInput {
  titulo: string;
  conteudo: string;
  canal: CanalMensagem;
}