import { NextResponse } from "next/server";



export async function GET(request: Request, context: { params: any }) {
  const { params } = context;
  const ID = params.id
  const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  try {
    const Requeste = await fetch(`${url}/businesses/${ID}?populate=%2A`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    const retorno = await Requeste.json();
    return NextResponse.json(retorno.data, { status: 200 });
  } catch (error) {
    console.log(error)
    throw error
  }
}