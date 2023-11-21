import { NextResponse } from "next/server";



export async function GET(request: Request, context: { params: any }) {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const { params } = context;
    const ID = params.id

    const response = await fetch(`${url}/empresas/${ID}?&populate=%2A`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });
    const retorno = await response.json();
    return NextResponse.json(retorno.data, { status: 200 });
  } catch (error: any) {
    console.log(!error.response.data.erro ? error : error.response.data.erro);
    return NextResponse.json({ error: !error.response.data.erro ? error : error.response.data.erro }, { status: 500 });
  }
}