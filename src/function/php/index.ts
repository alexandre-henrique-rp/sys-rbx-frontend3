import axios from "axios";


export const PHPApi = {
  get: async (url: string, email: string): Promise<any> => {
    try {
      const headers = {
        Email: email,
        Token: process.env.ATORIZZATION_TOKEN_RIBERMAX,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await axios.get(`${process.env.RIBERMAX_API_URL}${url}`, { headers });
      console.log('GET_PHP response', response.data);
      return response.data;
    } catch (error: any) {
      console.log("GET_PHP error", error.response.data);
      return error.response.data;
    }
  },
  post: async (dados: any, url: string, email: string): Promise<any> => {
    try {
      const params = new URLSearchParams(dados).toString();
      const headers = {
        Email: email,
        Token: process.env.ATORIZZATION_TOKEN_RIBERMAX,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await axios.post(`${process.env.RIBERMAX_API_URL}${url}`, params, { headers });
      console.log('POST_PHP response', response.data);
      return response.data;
    } catch (error: any) {
      console.log("POST_PHP error", error.response.data);
      return error.response.data;
    }
  },
  put: async (dados: any, url: string, email: string): Promise<any> => {
    try {
      const params = new URLSearchParams(dados).toString();
      const headers = {
        Email: email,
        Token: process.env.ATORIZZATION_TOKEN_RIBERMAX,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await axios.put(`${process.env.RIBERMAX_API_URL}${url}`, params, { headers });
      console.log('PUT_PHP response', response.data);
      return response.data;
    } catch (error: any) {
      console.log("PUT_PHP error", error.response.data);
      return error.response.data;
    }
  },

  delete: async (dados: any, url: string, email: string): Promise<any> => {
    try {
      const params = new URLSearchParams(dados).toString();
      const headers = {
        Email: email,
        Token: process.env.ATORIZZATION_TOKEN_RIBERMAX,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await axios.delete(`${process.env.RIBERMAX_API_URL}${url}`, { params, headers });
      console.log('DELETE_PHP response', response.data);
      return response.data;
    } catch (error: any) {
      console.log("DELETE_PHP error", error.response.data);
      return error.response.data;
    }
  }

};
