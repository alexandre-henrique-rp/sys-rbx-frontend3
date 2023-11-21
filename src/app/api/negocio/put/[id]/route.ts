import { NextResponse } from "next/server";


export async function PUT(request: Request, context: { params: any }) {
  const { params } = context;
  const ID = params.id
  const data = await request.json();
  const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  try {
    const Requeste = await fetch(`${url}/businesses/${ID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const retorno = await Requeste.json();
    return NextResponse.json(retorno.data, { status: 200 });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(!error.response.data? error.response.data : error, { status: error.response.status });
  }
}