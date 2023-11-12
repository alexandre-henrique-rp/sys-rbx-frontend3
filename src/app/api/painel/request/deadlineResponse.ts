
export const DeadLine = async (DataIncicio: string, DataFim: string, Vendedor: any) => {
  try {
    const BaseUrl: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${BaseUrl}/businesses?filters[date_conclucao][$between]=${DataIncicio}&filters[date_conclucao][$between]=${DataFim}&filters[status][$eq]=true&filters[vendedor][username][$eq]=${Vendedor}&filters[andamento][$eq]=1&sort[0]=id%3Adesc&fields[0]=etapa&fields[1]=andamento&fields[2]=Budget&fields[3]=DataRetorno&populate[vendedor][fields][0]=username`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error: any) {
    throw !error.response.data ? error : error.response.data;
  }
}