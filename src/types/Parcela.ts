// src/types/Parcela.ts

import { Pessoa } from './Pessoa';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Parcela {
  id: number;
  descricao: string;
  vencimento: string; // Formato "YYYY-MM-DD"
  valorTotal: number;
  valorParcelaCada: number;
  quitada: boolean;
  chavePix: string | null;
  codigoPixCopyPaste: string | null;
  cobrador: Pessoa;
  devedores: Pessoa[];
}

// ATUALIZADO: Interface para os dados de uma Parcela a serem enviados (POST/PUT)
export interface ParcelaInput {
  idCobrador: number;
  valorTotal: number;
  descricao: string;
  vencimento: string; // Formato "YYYY-MM-DD"
  quitada: boolean;
  chavePix: string | null; // Pode ser uma string vazia ou null se não houver
  idsDevedores: number[];
}