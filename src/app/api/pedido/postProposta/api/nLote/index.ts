

export const nLote = async () => {
  try {
    const NLoteEnvio: any = process.env.LOTE_INICIAL;
    const token = process.env.ATORIZZATION_TOKEN;
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/lotes?fields[0]=lote&sort=lote%3Adesc&pagination[limit]=1`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const resposta = await fetch(url, { headers });
    const [NLote]: any = await resposta.json();

    if (!NLoteEnvio && !NLote) {
      throw {
        response: { status: 404 },
        message: "Erro ao gerar numero de lote",
        erro: "Não foi possível gerar o número de lote",
        detalhes:
          "O número de lote inicial não foi encontrado e o retorno do Database foi null",
      };
    }

    if (!NLote ||
      [NLote.attributes.lote, "", null, undefined].includes(NLote.attributes.lote)) {
      return parseInt(NLoteEnvio || 0) + 1;
    }

    return parseInt(NLote.attributes.lote) + 1;

  } catch (error: any) {
    console.log(error);
    const status = error.response?.status || 500;
    const message = error.message || "Erro do Servidor Interno";
    throw {
      message,
      status,
      erro: error.erro || "[]",
      detalhes: error.detalhes || "null",
    };
  }
};