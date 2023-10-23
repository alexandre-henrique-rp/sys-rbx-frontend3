import axios from "axios";


export const Relatorio = async (DataIncicio: string, Vendedor: any, token: any) => {
  try {
    const processoData = new Date(DataIncicio);
    const mes = processoData.getMonth() + 1;
    const ano = processoData.getFullYear();

    const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/config-vendas?filters[vendedor][username][$eq]=${Vendedor}&filters[mes][$eq]=${mes}&filters[ano][$eq]=${ano}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data
  } catch (error: any) {
    return !!error.response.data.erro ? error.response.data.erro : error;
  }
}