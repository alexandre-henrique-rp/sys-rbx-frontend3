import { NextResponse } from "next/server";

export async function DELET(request: Request, context: { params: any }) {
  const { params } = context
  const { id } = params
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/config-vendas/${id}`,{
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_URL}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data.data, { status: 200 });
    }
  } catch (error: any) {
    console.log(!error.response.data.erro ? error : error.response.data.erro);
    return NextResponse.json(!error.response.data.erro ? error : error.response.data.erro, { status: 500 });
  }
  
}