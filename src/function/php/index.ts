
export const PHPApi = {
  get: async (url: string, email: string): Promise<any> => {
    const Inputheaders: any = {
      Email: email,
      Token: process.env.ATORIZZATION_TOKEN_RIBERMAX,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const response = await fetch(`${process.env.RIBERMAX_API_URL}${url}`, {
        method: 'GET',
        headers: Inputheaders,
        cache: 'no-store'
      })
      const retorno = await response.json();
      console.log('GET_PHP response', retorno);
      return retorno;
    } catch (error: any) {
      console.log("GET_PHP error", error.response.data);
      return error.response.data;
    }
  },
  post: async (dados: any, url: string, email: string): Promise<any> => {
    try {
      const params = new URLSearchParams(dados).toString();
      const Inputheaders: any = {
        Email: email,
        Token: process.env.ATORIZZATION_TOKEN_RIBERMAX,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      // const response = await axios.post(`${process.env.RIBERMAX_API_URL}${url}`, params, { headers });
      const response = await fetch(`${process.env.RIBERMAX_API_URL}${url}`, {
        method: 'POST',
        headers: Inputheaders,
        body: params,
      });
      const retorno = await response.json();
      console.log('POST_PHP response', retorno);
      return retorno;
    } catch (error: any) {
      console.log("POST_PHP error", error.response.data);
      return error.response.data;
    }
  },
  put: async (dados: any, url: string, email: string): Promise<any> => {
    try {
      const params = new URLSearchParams(dados).toString();
      const Inputheaders: any = {
        Email: email,
        Token: process.env.ATORIZZATION_TOKEN_RIBERMAX,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await fetch(`${process.env.RIBERMAX_API_URL}${url}`, {
        method: 'PUT',
        headers: Inputheaders,
        body: params,
      });
      const retorno = await response.json();
      console.log('PUT_PHP response', retorno);
      return retorno;
    } catch (error: any) {
      console.log("PUT_PHP error", error.response.data);
      return error.response.data;
    }
  },

  delete: async (dados: any, url: string, email: string): Promise<any> => {
    try {
      const params = new URLSearchParams(dados).toString();
      const Inputheaders: any = {
        Email: email,
        Token: process.env.ATORIZZATION_TOKEN_RIBERMAX,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const response = await fetch(`${process.env.RIBERMAX_API_URL}${url}`, {
        method: 'PUT',
        headers: Inputheaders,
        body: params,
      });
      const retorno = await response.json();
      console.log('DELETE_PHP response', retorno);
      return retorno;
    } catch (error: any) {
      console.log("DELETE_PHP error", error.response.data);
      return error.response.data;
    }
  }

};
