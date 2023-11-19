import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${url}/users?filters[confirmed][$eq]=true&sort[0]=username%3Adesc&fields[0]=username`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const retorno = await response.json();
    const userRetorno: any = retorno

    return NextResponse.json(userRetorno, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(!!error.response.data ? error.response.data : error, { status: !error.response.data ? 500 : 400 });
  }
};