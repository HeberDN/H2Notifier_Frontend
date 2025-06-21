import axios from 'axios';
import { Mensagem, MensagemInput } from '../types/Mensagem';
import { ApiResponse, PageResponse } from 'types/ApiResponses';

const API_URL = 'http://localhost:8080/api/v1/mensagens';

export const MensagemService = {
  getAllMensagens: async (page: number = 0, size: number = 10): Promise<PageResponse<Mensagem>> => {
    const response = await axios.get<ApiResponse<PageResponse<Mensagem>>>(`${API_URL}?page=${page}&size=${size}`);
    return response.data.data;
  },

  getMensagemById: async (id: number): Promise<Mensagem> => {
    const response = await axios.get<ApiResponse<Mensagem>>(`${API_URL}/${id}`);
    return response.data.data;
  },

  createMensagem: async (mensagem: MensagemInput): Promise<Mensagem> => {
    const response = await axios.post<ApiResponse<Mensagem>>(API_URL, mensagem);
    return response.data.data;
  },

  updateMensagem: async (id: number, mensagem: MensagemInput): Promise<Mensagem> => {
    const response = await axios.put<ApiResponse<Mensagem>>(`${API_URL}/${id}`, mensagem);
    return response.data.data;
  },

  deleteMensagem: async (id: number): Promise<void> => {
    await axios.delete<ApiResponse<void>>(`${API_URL}/${id}`);
  },
};