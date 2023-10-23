
const GetEmpresasGeral = async (
  data: {url: string, method: string, isRevalid?: number, isCache?: any}
) => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  try {
    if(data.isCache){
      console.log(data.isCache)
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.url}`, {
        method: `${data.method}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: data.isCache // permite atualizar a cada reload
      });
      const response = await requeste.json();
      return response
    } else if(data.isRevalid){
      const request = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.url}`, {
        method: `${data.method}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: data.isRevalid  //tempo para revalidar
        }
      });
      const response = await request.json();
      return response
  
    }else {
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.url}`, {
        method: `${data.method}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }) 
      const response = await requeste.json();
      return response
    }
  }
  catch (error: any) {
    return error;
  }
}

export default GetEmpresasGeral;