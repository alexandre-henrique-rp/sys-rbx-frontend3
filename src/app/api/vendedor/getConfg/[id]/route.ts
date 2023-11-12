import { NextResponse } from "next/server";

export async function GET(request: Request,context: { params: any }) {
  const { params } = context
  const { id } = params
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const BaseUrl: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${BaseUrl}/config-vendas?populate=*&filters[user][id][$eq]=${id}`,{
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data.data, { status: 200 });
    }
  } catch (error: any) {
    console.log(!error.response.data ? error : error.response.data);
    return NextResponse.json(!error.response.data ? error : error.response.data, { status: 500 });
  }
}