import { Feriado } from "@/app/api/painel/request/feriado";

export const getAllDaysOfMonth = async (month?: number, year?: number) => {
  const currentYear = year || new Date().getFullYear();
  const currentMonth = month ? month - 1 : new Date().getMonth();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  const diasDaSemana = [];
  let currentDate = new Date(firstDay);

  while (currentDate <= lastDay) {
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const dayOfWeek = currentDate.getUTCDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      diasDaSemana.push({
        id: currentDate.getDate(),
        date: formattedDate,
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const feriados = await Feriado();

  const diasUteis = diasDaSemana.filter((day) => {
    const isFeriado = feriados.includes(day.date);
    return !isFeriado;
  });

  const retorno = {
    DataInicio: firstDay.toISOString(),
    DataFim: lastDay.toISOString(),
    Dias: diasUteis,
  };

  return retorno;
};