export const savetoken = async (data: any, Complementar: string) => {
  try {
    console.log(data);
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    console.log(`${url}/${Complementar}`);
    const request = await fetch(`${url}/${Complementar}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    if(request.ok){
      const retorno = await request.json();
      return retorno;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}