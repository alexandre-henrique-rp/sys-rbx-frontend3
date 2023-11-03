

export const UltimoLote = async () => {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const LotePadrão = process.env.LOTE_INICIAL

    const GetUltimoLote = await fetch(`${url}/lotes?fields[0]=lote&sort=lote%3Adesc&pagination[limit]=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const RetornoGetUltimoLote = await GetUltimoLote.json();
    const UltimoLote = !RetornoGetUltimoLote.data[0] ? LotePadrão : RetornoGetUltimoLote.data[0].attributes.lote

    return Number(UltimoLote)+1;
  } catch (error: any) {
    console.error(error)
    throw !error.response.data.error ? error : error.response.data
  }
}