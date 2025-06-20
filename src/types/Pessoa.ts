export enum TipoPessoa {
  DEVEDOR = 'DEVEDOR',
  COBRADOR = 'COBRADOR',
}

export interface PessoaInput {
  nome: string;
  email: string;
  telefone: string;
  tipoPessoa: TipoPessoa;
  // chavePix e codigoPixCopyPaste não são enviados na criação
}

export interface Pessoa extends PessoaInput {
  id: number;
  chavePix: string | null;
  codigoPixCopyPaste: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}