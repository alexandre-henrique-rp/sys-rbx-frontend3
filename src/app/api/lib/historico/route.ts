import FetchRequest from '@/function/fetch/request/route';

export const Historico = async (txt: any, url: string) => {
  try {
    const verifique = await FetchRequest.get(url);
    const respVerifique = verifique.data;
    if (!respVerifique) {
      return verifique.data.error;
    }
    
    const { history } = respVerifique.attributes;
    const updatedHistory = [...history, txt];
    
    const data = {
      data: {
        history: updatedHistory,
      },
    };
    
    const response = await FetchRequest.put(url, data);

    const { id, attributes: { nome } } = response.data.data;
    const resp = `Alteração do cliente id: ${id}, nome: ${nome}, foi registrada!`;
    
    return resp;
  } catch (error: any) {
    console.log(error.response.data.error);
    return error.response.data.error;
  }
};
