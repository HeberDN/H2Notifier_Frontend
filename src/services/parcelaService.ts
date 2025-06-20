// src/services/parcelaService.ts

import api from './api';
import axios from 'axios';
import { Parcela, ApiResponse, ParcelaInput } from '../types/Parcela';

export const parcelaService = {
  // GET: Listar Todas Parcelas
  // http://localhost:8080/api/v1/parcelas
  getAllParcelas: async (): Promise<ApiResponse<Parcela[]>> => {
    try {
      const response = await api.get<ApiResponse<Parcela[]>>('/parcelas');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao buscar todas as parcelas');
      }
      throw new Error('Erro de rede ou desconhecido ao buscar todas as parcelas');
    }
  },

  // GET: Buscar Parcela Por Id
  // http://localhost:8080/api/v1/parcelas/1
  getParcelaById: async (id: number): Promise<ApiResponse<Parcela>> => {
    try {
      const response = await api.get<ApiResponse<Parcela>>(`/parcelas/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao buscar parcela com ID ${id}`);
      }
      throw new Error('Erro de rede ou desconhecido ao buscar parcela por ID');
    }
  },

  // GET: Listar Parcelas Por Vencimento (já tínhamos, apenas mantendo)
  // http://localhost:8080/api/v1/parcelas/vencimento/2025-06-12
  getParcelasByVencimento: async (dataVencimento: string): Promise<ApiResponse<Parcela[]>> => {
    try {
      const response = await api.get<ApiResponse<Parcela[]>>(`/parcelas/vencimento/${dataVencimento}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao buscar parcelas para o vencimento ${dataVencimento}`);
      }
      throw new Error('Erro de rede ou desconhecido ao buscar parcelas por vencimento');
    }
  },

  // GET: Listar Parcelas Vencidas
  // http://localhost:8080/api/v1/parcelas/vencidas
  getParcelasVencidas: async (): Promise<ApiResponse<Parcela[]>> => {
    try {
      const response = await api.get<ApiResponse<Parcela[]>>('/parcelas/vencidas');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao buscar parcelas vencidas');
      }
      throw new Error('Erro de rede ou desconhecido ao buscar parcelas vencidas');
    }
  },

  // GET: Listar Parcela(s) Por Id Cobrador
  // http://localhost:8080/api/v1/parcelas/cobrador/1
  getParcelasByCobradorId: async (cobradorId: number): Promise<ApiResponse<Parcela[]>> => {
    try {
      const response = await api.get<ApiResponse<Parcela[]>>(`/parcelas/cobrador/${cobradorId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao buscar parcelas para o cobrador ${cobradorId}`);
      }
      throw new Error('Erro de rede ou desconhecido ao buscar parcelas por cobrador');
    }
  },

  // GET: Listar Parcela(s) Por Id Devedor
  // http://localhost:8080/api/v1/parcelas/devedor/2
  getParcelasByDevedorId: async (devedorId: number): Promise<ApiResponse<Parcela[]>> => {
    try {
      const response = await api.get<ApiResponse<Parcela[]>>(`/parcelas/devedor/${devedorId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao buscar parcelas para o devedor ${devedorId}`);
      }
      throw new Error('Erro de rede ou desconhecido ao buscar parcelas por devedor');
    }
  },

  // GET: Calcular Total a Receber (já tínhamos, mantendo)
  // http://localhost:8080/api/v1/parcelas/total-a-receber/1
  getTotalAReceber: async (cobradorId: number): Promise<ApiResponse<number>> => {
    try {
      const response = await api.get<ApiResponse<number>>(`/parcelas/total-a-receber/${cobradorId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao calcular total a receber para o cobrador ${cobradorId}`);
      }
      throw new Error('Erro de rede ou desconhecido ao calcular total a receber');
    }
  },

  // POST: Cadastrar Parcela
  // http://localhost:8080/api/v1/parcelas
  createParcela: async (data: ParcelaInput): Promise<ApiResponse<Parcela>> => {
    try {
      const response = await api.post<ApiResponse<Parcela>>('/parcelas', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao cadastrar parcela');
      }
      throw new Error('Erro de rede ou desconhecido ao cadastrar parcela');
    }
  },

  // PUT: Atualizar Parcela
  // http://localhost:8080/api/v1/parcelas/1
  updateParcela: async (id: number, data: ParcelaInput): Promise<ApiResponse<Parcela>> => {
    try {
      const response = await api.put<ApiResponse<Parcela>>(`/parcelas/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao atualizar parcela com ID ${id}`);
      }
      throw new Error('Erro de rede ou desconhecido ao atualizar parcela');
    }
  },

  // PUT: Quitar Parcela
  // http://localhost:8080/api/v1/parcelas/1/quitar
  quitarParcela: async (id: number): Promise<ApiResponse<Parcela>> => {
    try {
      const response = await api.put<ApiResponse<Parcela>>(`/parcelas/${id}/quitar`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao quitar parcela com ID ${id}`);
      }
      throw new Error('Erro de rede ou desconhecido ao quitar parcela');
    }
  },

  // DELETE: Deletar Parcela
  // http://localhost:8080/api/v1/parcelas/13
  deleteParcela: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/parcelas/${id}`);
      // A API retorna 204 No Content para delete, então 'data' pode ser nulo.
      // Retornamos um objeto de sucesso consistente ou null se a API não retorna nada.
      return response.data || { success: true, message: 'Parcela deletada com sucesso.', data: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || `Erro ao deletar parcela com ID ${id}`);
      }
      throw new Error('Erro de rede ou desconhecido ao deletar parcela');
    }
  },
};