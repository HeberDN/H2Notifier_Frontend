// utils/formatters.ts
export const formatarDataParaPtBR = (dateString: string): string => {
  // Cria um objeto Date a partir da string ISO (YYYY-MM-DD)
  const date = new Date(dateString + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
  
  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return "Data Inválida";
  }

  // Opções para o formato da data: dia, mês e ano numéricos
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  // Retorna a data formatada para pt-BR
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};

export const formatarMoedaParaPtBR = (valor: number): string => {
  // Opções para o formato da moeda: BRL para Real Brasileiro
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2, // Garante pelo menos duas casas decimais
    maximumFractionDigits: 2, // Garante no máximo duas casas decimais
  };

  // Retorna o valor formatado para Real Brasileiro
  return new Intl.NumberFormat('pt-BR', options).format(valor);
};