

export const GetLoteProposta = async (nProposta: any) => {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const resposta = await fetch(`${url}/lotes?populate=*&filters[nProposta][$eq]=${nProposta}&sort[0]=id%3Adesc`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const data: any = resposta.json();

    if (data.error) {
      return data.error.response.data.error;
    }

    if (data.data.length === 0) {
      throw {
        response: {
          status: 404,
          message: "Esse pedido não possui lotes",
          detalhes:
            "A solicitação de lotes referente a esse pedidos retornou 0",
        },
      };
    }

    return data.data;
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.message ||
      error.response?.message ||
      "Erro do Servidor Interno";
    const errorResponse = {
      message,
      status,
      erro: error.erro || error.response|| "[]",
      detalhes: error.detalhes|| error.response.message || "null",
    };
    return errorResponse;
  }
};
