import { NextResponse } from "next/server";

export async function GET (request: Request)  {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const data: any = await request.json();
  // data: {url: string, method: string, isRevalid?: number, isCache?: any}
  try {
    if(data.isCache){
      console.log(data.isCache)
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.url}`, {
        method: `${data.method}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: data.isCache // permite atualizar a cada reload
      });
      const response = await requeste.json();
      return NextResponse.json(response, { status: 200 });

    } else if(data.isRevalid){
      const request = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.url}`, {
        method: `${data.method}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: data.isRevalid  //tempo para revalidar
        }
      });
      const response = await request.json();
      return NextResponse.json(response, { status: 200 });
  
    }else {
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${data.url}`, {
        method: `${data.method}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }) 
      const response = await requeste.json();
      return NextResponse.json(response, { status: 200 });
    }
  }
  catch (error: any) {
    console.error(error)
    throw error
  }
}