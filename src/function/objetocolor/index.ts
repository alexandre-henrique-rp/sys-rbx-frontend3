// Função para encontrar o objeto mais próximo da data atual e definir a cor

import { addDays, parseISO, startOfDay } from "date-fns";
import { calcularDiferencaEmDias } from "../Diferenca_de_dias";

export const encontrarObjetoMaisProximoComCor = (dados: any[], user: string): {
  data: Date | null;
  cor: "yellow" | "#FC0707" | "#3B2DFF" | "gray" | 'transparent';
  info: string;
}  => {
  const dataAtual = startOfDay(new Date()); // Zera o horário da data atual

  // if (dados.some((i: any) => !i.attributes.status_atendimento)) {
  //   return { data: null, cor: "gray", info: "Você não tem interação agendada" };
  // }

  const objetoMaisProximo = dados.slice(-1)[0];

  if (objetoMaisProximo?.attributes.status_atendimento === false ) {
    return {
      data: addDays(dataAtual, 500),
      cor: "gray",
      info: "Você não tem interação agendada",
    };
  }else {

    const proximaData = startOfDay(parseISO(objetoMaisProximo?.attributes.proxima)); // Converte a string para um objeto Date e zera o horário
    const diferencaEmDias = calcularDiferencaEmDias(dataAtual, proximaData); // Calcula a diferença em dias

    if (diferencaEmDias === 0 && objetoMaisProximo.attributes.vendedor_name === user) {
      return {
        data: proximaData,
        cor: "yellow",
        info: "Você tem interação agendada para hoje",
      };
    } else if (diferencaEmDias < 0 && objetoMaisProximo.attributes.vendedor_name === user) {
      return {
        data: proximaData,
        cor: "#FC0707",
        info: "Você tem interação que já passou, a data agendada era",
      };
    } else if (diferencaEmDias > 0 && objetoMaisProximo.attributes.vendedor_name === user) {
      return {
        data: proximaData,
        cor: "#3B2DFF",
        info: "Você tem interação agendada para",
      };
    } else{
      return {
        data: null,
        cor: "transparent",
        info: "",
      }
    }
  }
};

