
export const calcularDiferencaEmDias = (data1: Date, data2: Date): number => {
  const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;
  const data1UTC = Date.UTC(data1.getFullYear(), data1.getMonth(), data1.getDate());
  const data2UTC = Date.UTC(data2.getFullYear(), data2.getMonth(), data2.getDate());
  return Math.floor((data2UTC - data1UTC) / umDiaEmMilissegundos);
};