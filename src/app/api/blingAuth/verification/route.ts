import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fornecedor: any = searchParams.get('fornecedor');
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    const UrlFinal = fornecedor === 'Bragheto'? `${url}/bragheto`: fornecedor === 'Renato'? `${url}/renato` : `${url}/ribermax`
    const response = await fetch(UrlFinal, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });
    const retorno = await response.json();

    const expire = Number(retorno.data.attributes.periodo);
    const DataUpdate = new Date(retorno.data.attributes.update);
    const Token = retorno.data.attributes.token;
    const UpdateSegundos = DataUpdate.getTime() / 1000;

    const Authorization = UpdateSegundos > expire? true : false

    if (Authorization) {
      const data = {
        expire,
        DataUpdate,
        Token,
        auth: true
      }
      return NextResponse.json(data, { status: 200 });
    } else {
      const data = {
        expire,
        DataUpdate,
        Token,
        auth: false
      }
      return NextResponse.json(data, { status: 200 });
    }

  } catch (error) {
    console.error(error)
    throw error
  }
}