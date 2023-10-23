import axios from "axios";

export const Feriado = async (token: any) => {
  try {

      const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/feriados`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    
  } catch (error: any) {
    console.log(error.response.data.error);
    return [];
  }
};