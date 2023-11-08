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
    });
    const retorno = await response.json();
    const userRetorno: any = retorno.data

    return NextResponse.json({userRetorno}, { status: 200 });
  } catch (error) {
    console.log(error);
    throw error
  }
};