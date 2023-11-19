


import { NextResponse } from "next/server";


export async function PUT (request: Request, context: { params: any }) {
  const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const body = await request.json();
  const { params } = context;
  const UID = params.id;
  try {
    const response = await fetch(`${url}/representantes/${UID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const data = await response.json();
    return NextResponse.json(data.data, { status: 200 });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(!error.response.data ? error : error.response.data, { status: !error.response.data ? 500 : 400 });
  }
}