import { isSameDay, parseISO } from "date-fns";


export const DataSeparete = (data: any, calendar: any) => {
  try {
    const Calendario: any = !!calendar ? calendar.Dias : [];
    const diasMesclados = Calendario.map((dia: any) => {
      const clientesCorrespondentes = data.filter((c: any) => {
        const dateConclusao = parseISO(c.attributes.date_conclucao);
  
        if (isSameDay(dateConclusao, parseISO(dia.date))) {
          return true;
        }
  
        return false;
      }).map((cliente: any) => {
        return {
          ...cliente,
          correspondingDate: parseISO(dia.date)
        };
      });
  
      return {
        id: dia.id,
        date: dia.date,
        clientes: clientesCorrespondentes
      };
    });
  
    const parts: any = diasMesclados.reduce(
      (accumulator: any, item: any) => {
        const day = parseInt(item.date.slice(-2));
  
        if (day >= 1 && day <= 10) {
          accumulator[0].push(item);
        } else if (day >= 11 && day <= 20) {
          accumulator[1].push(item);
        } else {
          accumulator[2].push(item);
        }
  
        return accumulator;
      },
      [[], [], []]
    );
  
    return parts;
  }  catch (error) {
    return error
  }


}