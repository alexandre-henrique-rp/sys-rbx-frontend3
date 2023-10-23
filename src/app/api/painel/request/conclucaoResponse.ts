import { BaseURL } from "@/function/request";


export const Conclucao = async (DataIncicio: string, DataFim: string, Vendedor: any) => {
  try {
      const response = await BaseURL(`/businesses?filters[date_conclucao][$between]=${DataIncicio}&filters[date_conclucao][$between]=${DataFim}&filters[vendedor][username][$eq]=${Vendedor}&filters[status][$eq]=true&filters[andamento][$eq]=5&sort[0]=id%3Adesc&fields[0]=deadline&fields[1]=createdAt&fields[2]=DataRetorno&fields[3]=date_conclucao&fields[4]=nBusiness&fields[5]=andamento&fields[6]=Budget&fields[7]=etapa&populate[empresa][fields][0]=nome&populate[vendedor][fields][0]=username&populate[pedidos][fields][0]=totalGeral`);
      return response.data.data;
  } catch (error: any) {
    return error;
  }
}