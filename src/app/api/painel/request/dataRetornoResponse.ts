import axios from "axios";


export const DataRetorno = async (DataIncicio: string, DataFim: string, Vendedor: any, token: any) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/businesses?filters[DataRetorno][$between]=${DataIncicio}&filters[DataRetorno][$between]=${DataFim}&filters[vendedor][username][$eq]=${Vendedor}&filters[status][$eq]=true&filters[andamento][$eq]=3&sort[0]=id%3Adesc&fields[0]=etapa&fields[1]=andamento&fields[2]=Budget&fields[3]=DataRetorno&populate[vendedor][fields][0]=username`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    return error;
  }
}