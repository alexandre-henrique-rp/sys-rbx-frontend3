import { NextResponse } from "next/server";
import { LogEmpresa } from "../../lib/logEmpresa";


export async function POST (request: Request) {
  const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const body = await request.json();
  try {
    const response = await fetch(`${url}/representantes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    await LogEmpresa(body.data.empresa, 'Representante Create', body.data.user)
    return NextResponse.json(data.data, { status: 200 });
  } catch (error: any) {
    console.log(!error.response.data ? error : error.response.data)
    return NextResponse.json(!error.response.data ? error : error.response.data, { status: !error.response.data ? 500 : 400 });
  }
}