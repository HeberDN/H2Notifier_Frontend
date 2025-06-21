// O T é o tipo dos itens dentro do array 'content' (ex: Mensagem, Parcela, Devedor)
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Interface para padronizar a resposta de sucesso da API
// O T é o tipo dos dados retornados no campo 'data' (ex: Mensagem, Parcela, PageResponse<Mensagem>)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}