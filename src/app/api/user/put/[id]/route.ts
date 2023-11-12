import { NextResponse } from "next/server";

export async function PUT(request: Request, context : { params: any }) {
  const { params } = context
  const { id } = params
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const body = await request.json();
    const response = await fetch(`${url}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if(response.ok){
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    }
  }catch(error: any){
    console.log(!error.response.data ? error : error.response.data)
    throw !error.response.data ? error : error.response.data;
  }
  
}