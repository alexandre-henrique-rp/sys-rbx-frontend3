import { calcularDiferencaEmDias } from "@/function/Diferenca_de_dias";
import { parseISO, startOfDay } from "date-fns";

  // Função para processar interações de vendedores
  export const processarVendedorInteracoes = (dataAtual: Date, Dados: any, session: any) => {

    const VendedorInteracaoMap = Dados.map((i: any) => {
      const interacoes = i.attributes.interacaos.data;
      const interacoesVendedor = interacoes.filter((interacao: any) => interacao.attributes.vendedor_name === session.user.name);
      const ultimaInteracao = interacoesVendedor[interacoesVendedor.length - 1];

      if (!ultimaInteracao) {
        return null;
      }

      const proximaData = startOfDay(parseISO(ultimaInteracao.attributes.proxima));
      const diferencaEmDias = calcularDiferencaEmDias(dataAtual, proximaData);

      let DifDias;
      let RetornoInteracao;
      if (ultimaInteracao.attributes.status_atendimento === false) {
        RetornoInteracao = { proxima: null, cor: 'gray', info: 'Você não tem interação agendada' };
        DifDias = 500;
      } else if (diferencaEmDias === 0) {
        RetornoInteracao = { proxima: proximaData.toISOString(), cor: 'yellow', info: 'Você tem interação agendada para hoje' };
        DifDias = diferencaEmDias;
      } else if (diferencaEmDias < 0) {
        RetornoInteracao = { proxima: proximaData.toISOString(), cor: '#FC0707', info: `Você tem interação que já passou, a data agendada era ${proximaData.toLocaleDateString()}` };
        DifDias = diferencaEmDias;
      } else {
        RetornoInteracao = { proxima: proximaData.toISOString(), cor: '#3B2DFF', info: `Você tem interação agendada para ${proximaData.toLocaleDateString()}` };
        DifDias = diferencaEmDias;
      }

      return {
        id: i.id,
        attributes: {
          ...i.attributes,
          interacaos: {
            data: {
              id: ultimaInteracao?.id,
              proxima: RetornoInteracao?.proxima,
              cor: RetornoInteracao?.cor,
              info: RetornoInteracao?.info,
            },
          },
          diferencaEmDias: DifDias, // Adicione a diferença de dias como uma propriedade
        },
      };
    }).filter(Boolean);

    VendedorInteracaoMap.sort((a: any, b: any) => {
      return a.attributes.diferencaEmDias - b.attributes.diferencaEmDias;
    });

    const VendedorInteracao0 = Dados.filter((f: any) => f.attributes.interacaos.data?.length === 0);
    const DataVendedor: any = [...VendedorInteracaoMap, ...VendedorInteracao0];

    return DataVendedor;
  };