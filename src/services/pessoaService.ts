// src/services/pessoaService.ts

import axios from 'axios';
import { Pessoa, PessoaInput, ApiResponse } from '../types/Pessoa'; // Importa os tipos definidos

const API_URL = 'http://localhost:8080/api/v1/pessoas'; // URL base da sua API de Pessoas

// Configuração do Axios para a base da API
// IMPORTANTE: Aqui, 'api' é uma instância local para pessoaService.
// O ideal é usar a instância global 'api' de 'src/services/api.ts' para reuso.
// Vamos ajustar para usar a instância global para manter a consistência.
import api from './api'; // <--- Importa a instância global de api.ts

export const pessoaService = {
  // GET: Listar todas as Pessoas
  getAllPessoas: async (): Promise<ApiResponse<Pessoa[]>> => {
    try {
      // Use a instância global 'api' e o caminho relativo '/pessoas'
      const response = await api.get<ApiResponse<Pessoa[]>>('/pessoas');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao buscar pessoas');
      }
      throw new Error('Erro de rede ou desconhecido ao buscar pessoas');
    }
  },

  // POST: Cadastrar nova Pessoa
  createPessoa: async (data: PessoaInput): Promise<ApiResponse<Pessoa>> => {
    try {
      // Use a instância global 'api' e o caminho relativo '/pessoas'
      const response = await api.post<ApiResponse<Pessoa>>('/pessoas', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao cadastrar pessoa');
      }
      throw new Error('Erro de rede ou desconhecido ao cadastrar pessoa');
    }
  },

  // GET: Obter Pessoa por ID (opcional, mas comum)
  getPessoaById: async (id: number): Promise<ApiResponse<Pessoa>> => {
    try {
      const response = await api.get<ApiResponse<Pessoa>>(`/pessoas/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao buscar pessoa com ID ${id}`);
      }
      throw new Error('Erro de rede ou desconhecido ao buscar pessoa');
    }
  },

  // PUT/PATCH: Atualizar Pessoa (opcional)
  updatePessoa: async (id: number, data: Partial<PessoaInput>): Promise<ApiResponse<Pessoa>> => {
    try {
      const response = await api.put<ApiResponse<Pessoa>>(`/pessoas/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao atualizar pessoa com ID ${id}`);
      }
      throw new Error('Erro de rede ou desconhecido ao atualizar pessoa');
    }
  },

  // DELETE: Excluir Pessoa (opcional)
  deletePessoa: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/pessoas/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao excluir pessoa com ID ${id}`);
      }
      throw new Error('Erro de rede ou desconhecido ao excluir pessoa');
    }
  },
};