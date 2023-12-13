import { NextResponse } from "next/server";

export async function PUT(request: Request, context: { params: any }) {
  const { params } = context;
  const id = params.id;
  const body = await request.json();
  const BaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN

  try {
    const response = await fetch(`${BaseUrl}/pedidos/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })
    const retorno = await response.json();
    if (retorno.data) {
      return NextResponse.json(retorno.data, { status: 200 });
    }else {
      return NextResponse.json(retorno.error, { status: 500 });
    }
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(!error.response.data.error ? error : error.response.data, { status: 500 });
  }

}