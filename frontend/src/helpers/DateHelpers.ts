export const getMonthName = (date: Date, type: 'long' | 'short') =>
  date.toLocaleString('pt-BR', { month: type }).replace('.', '');
