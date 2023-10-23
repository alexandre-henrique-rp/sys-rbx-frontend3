import { calcularDiferencaEmDias } from "@/function/Diferenca_de_dias";
import { parseISO, startOfDay } from "date-fns";



  // Função para processar interações sem vendedor
  export const processarSemVendedorInteracoes = (dataAtual: Date, Dados: any, session: any) => {
    const filtroSemVendedor: any = Dados.filter((f: any) => {
      if (session.user.pemission !== 'Adm') {
        return f.attributes.user.data?.attributes.username == null;
      } else {
        return f.attributes.user.data?.attributes.username !== session.user.name;
      }
    });

    const FiltroInteracaoVendedor = filtroSemVendedor.map((i: any) => {
      const interacoes = i.attributes.interacaos.data;
      const filtro = interacoes.filter((interacao: any) => interacao.attributes.vendedor_name == session.user.name);
      if (filtro.length > 0) return i;
    })

    const valida = FiltroInteracaoVendedor.filter((f: any) => f?.attributes?.interacaos.data?.length > 0);


    const SemVendedorInteracaoMap = valida.map((i: any) => {
      const interacoes = i.attributes.interacaos.data;
      const ultimaInteracao = interacoes[interacoes.length - 1];

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
              vendedor_name: ultimaInteracao.attributes.vendedor_name,
            },
          },
          diferencaEmDias: DifDias, // Adicione a diferença de dias como uma propriedade
        },
      };
    });

    SemVendedorInteracaoMap.sort((a: any, b: any) => {
      return a.attributes.diferencaEmDias - b.attributes.diferencaEmDias;
    });

    const SemVendedorInteracao0 = filtroSemVendedor.filter((f: any) => f.attributes.interacaos.data.length == 0);

    const FiltroInteracaoVendedor1 = filtroSemVendedor.map((i: any) => {
      const interacoes = i.attributes.interacaos.data;
      const filtro = interacoes.filter((interacao: any) => interacao.attributes.vendedor_name !== session.user.name);
      if (filtro.length > 0) return i;
    })
    const SemVendedorInteracao1 = FiltroInteracaoVendedor1.filter((f: any) => f?.attributes.interacaos.data.length > 0);

    const mergedArray = [...SemVendedorInteracao0, ...SemVendedorInteracao1];

    mergedArray.sort((a, b) => {
      const nomeA = a.attributes.nome.toLowerCase();
      const nomeB = b.attributes.nome.toLowerCase();
      if (nomeA < nomeB) return -1;
      if (nomeA > nomeB) return 1;
      return 0;
    });


    const DataVendedorSemVendedor: any = [...SemVendedorInteracaoMap, ...mergedArray];

    return DataVendedorSemVendedor;
  };