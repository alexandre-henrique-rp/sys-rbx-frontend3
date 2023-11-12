export const Conclucao = async (DataIncicio: string, DataFim: string, Vendedor: any) => {
  try {
    const BaseUrl: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${BaseUrl}/businesses?filters[date_conclucao][$between]=${DataIncicio}&filters[date_conclucao][$between]=${DataFim}&filters[vendedor][username][$eq]=${Vendedor}&filters[status][$eq]=true&filters[andamento][$eq]=5&sort[0]=id%3Adesc&fields[0]=deadline&fields[1]=createdAt&fields[2]=DataRetorno&fields[3]=date_conclucao&fields[4]=nBusiness&fields[5]=andamento&fields[6]=Budget&fields[7]=etapa&populate[empresa][fields][0]=nome&populate[vendedor][fields][0]=username&populate[pedidos][fields][0]=totalGeral`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error: any) {
    throw !error.response.data ? error : error.response.data;
  }
}