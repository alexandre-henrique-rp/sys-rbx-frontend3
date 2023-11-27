import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const BaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");
  try {

    const response = await fetch(`${BaseUrl}/empresas?filters[status][$eq]=true&filters[inativStatus][$eq]=3&filters[user][username][$eq]=${user}&filters[ultima_compra][$notNull]=true&fields[0]=nome&fields[1]=ultima_compra&fields[2]=penultima_compra&fields[3]=valor_ultima_compra&fields[4]=inativStatus&fields[5]=inativOk&fields[6]=createdAt&populate[user][fields][0]=username`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    })
    if (response.ok) {
      const retorno = await response.json();
      return NextResponse.json(!!retorno.data? retorno.data : retorno, { status: 200 });
    }
  } catch (error: any) {
    console.error(!error.response.data.error ? error : error.response.data)
    return NextResponse.json(!error.response.data.error ? error : error.response.data, { status: 500 });
  }
}