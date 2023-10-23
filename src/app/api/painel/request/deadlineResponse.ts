import axios from "axios";



export const DeadLine = async (DataIncicio: string, DataFim: string, Vendedor: any, token: any) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/businesses?filters[date_conclucao][$between]=${DataIncicio}&filters[date_conclucao][$between]=${DataFim}&filters[status][$eq]=true&filters[vendedor][username][$eq]=${Vendedor}&filters[andamento][$eq]=1&sort[0]=id%3Adesc&fields[0]=etapa&fields[1]=andamento&fields[2]=Budget&fields[3]=DataRetorno&populate[vendedor][fields][0]=username`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    return error
  }
}