
export const RegCompra = async (id: number, valor: string) => {
  try {
    const bodyData = {
      data: {
        ultima_compra: new Date().toISOString().slice(0, 10),
        valor_ultima_compra: valor,
      },
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empresas/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(bodyData),
    
    });
    const data = await response.json();
    console.log(data);
  } catch (error: any) {
    console.log(error.response.data);
  }
};
