

export const GetCnpj = async(CNPJ: string) => {
  let url = 'https://publica.cnpj.ws/cnpj/' + CNPJ;
  try {
    const request = await fetch(url);
    const response = request.json();
    return response;

  } catch (error: any) {
      return error.response?.data.detalhes;
  }
}