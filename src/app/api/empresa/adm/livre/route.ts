import { error } from "console";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;


    const SemVendedor = await fetch(`${url}/empresas?filters[user][username][$null]=true&sort[0]=nome%3Aasc&fields[0]=nome&populate[user][fields][0]=username&populate[businesses]=*&populate[interacaos][fields][0]=proxima&populate[interacaos][fields][1]=vendedor_name&populate[interacaos][fields][2]=status_atendimento&pagination[limit]=8000`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    })
    
    if (!SemVendedor.ok) throw error;
    const retornoSemVendedor = await SemVendedor.json();

    return NextResponse.json(retornoSemVendedor.data, { status: 200 });
  } catch (error) {
    console.error(error)
    throw error
  }
}