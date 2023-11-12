
export const Feriado = async () => {
  try {
    const BaseUrl: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${BaseUrl}/feriados`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if(response.ok){
        const data = await response.json();
        return data.data;
      }
  } catch (error: any) {
    throw !error.response.data ? error : error.response.data;
  }
};