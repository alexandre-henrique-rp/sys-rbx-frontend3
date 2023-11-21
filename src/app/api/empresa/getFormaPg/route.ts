import { NextResponse } from "next/server";



export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const EmpresaId = searchParams.get('EmpresaId');
  const BaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const Token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  try {
    const request = await fetch(`${BaseUrl}/formapgs?filters[empresa][id][$null]=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`
      },
      cache: "no-store"
    })
    const request2 = await fetch(`${BaseUrl}/formapgs?filters[empresa][id][$eq]=${EmpresaId}&populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`
      },
      cache: "no-store"
    })
    const response = await request.json(); 
    const response2 = await request2.json();
    const data = [...response.data, ...response2.data]
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(!!error.response.data? error.response.data : error)
    return NextResponse.json(!!error.response.data? error.response.data : error, { status: error.response.status });
  }
  
  
}