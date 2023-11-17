
export const Relatorio = async (mes: any, ano: any, Vendedor: any,) => {
  try {
    const BaseUrl: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${BaseUrl}/config-vendas?filters[vendedor][username][$eq]=${Vendedor}&filters[mes][$eq]=${mes}&filters[ano][$eq]=${ano}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if(response.ok){
      const data = await response.json();
      return data.data;
    }
  } catch (error: any) {
    return !!error.response.data.erro ? error.response.data.erro : error;
  }
}