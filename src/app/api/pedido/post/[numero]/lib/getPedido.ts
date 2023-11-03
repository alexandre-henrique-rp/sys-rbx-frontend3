
export const GetPedido = async (NPedido: any) => {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    const response = await fetch(`${url}/pedidos?populate=*&filters[nPedido][$eq]=${NPedido}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resposta = await response.json();
    const [retorno] = resposta.data
    
    return retorno
  } catch (error: any) {
    console.error(error)
    throw !error.response.data.error ? error : error.response.data    
  }
}