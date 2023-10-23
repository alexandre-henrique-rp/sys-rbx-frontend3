

export const LogEmpresa = async (
  id: any,
  tipo: string,
  solicitante: string
) => {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    const request = await fetch(`${url}/empresas/${id}?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    const Retorno = await request.json();
    const dados = Retorno.data;

    const atributes = !!dados.attributes ? dados.attributes : dados.data;
    
    const BobyData = {
      data: {
        dados: { data: { ...atributes } },
        tipo: tipo,
        solicitante: solicitante,
        data: new Date().toISOString(),
        CNPJ: atributes.CNPJ,
      },
    };

    const response = await fetch(`/log-empresas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(BobyData),
    });

    const LogRetorno = await response.json();

    console.log("registro de log alteração de empresas", LogRetorno.data);

    const DataRetorno = {
      message: "log registrado com sucesso",
      data: LogRetorno.data,
    }
    return DataRetorno;
  } catch (err: any) {
    console.log(
      "registro erro de log alteração de empresas",
      err.response.data
    );
    const DataRetorno = {
      message: 'registro erro de log alteração de empresas',
      data: !err.response.data ? err : err.response.data,
    }
    return DataRetorno;
  }
};