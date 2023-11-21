export const IncidentRecord = async (txt: any, business: string) => {
  try {
    const BaseUrl: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const url = '/businesses/' + business;
  const verifique = await fetch(`${BaseUrl}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const respVerifique: any = verifique.json();
  const { incidentRecord } = respVerifique.attributes;

  const data = {
    data: {
      incidentRecord: [...incidentRecord, txt],
    },
  };

  const response = await fetch(`${BaseUrl}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  const resp = await response.json();

  const resposta = {
    msg:`acrescentado mais 1 registro`,
    data: resp
  }
  return resposta
  } catch (error: any) {
    console.log(!error.response.data.error ? error : error.response.data);
    return !error.response.data.error ? error : error.response.data
  }
};
