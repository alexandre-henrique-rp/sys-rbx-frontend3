import { NextResponse } from "next/server";



export async function POST(request: Request) {
  const data = await request.json()
  try {
    const clientId: any = data.id;
    const clientSecret: any = data.secret;
    // const credentials = btoa(`${clientId}:${clientSecret}`);
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    console.log("🚀 ~ file: route.ts:12 ~ POST ~ credentials:", credentials)
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    };
    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('code', data.code);

    const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseData = await response.json();
    console.log("🚀 ~ file: index.tsx:86 ~ operacao ~ response:", responseData);
    if (responseData.access_token) {
      const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      const request = await fetch(`${url}/${data.fornecedor.toLowerCase()}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: responseData.access_token,
          periodo: responseData.expires_in,
          update: new Date().toISOString()
        })
      });
      if (!request.ok) {
        throw new Error('Ocorreu um erro durante a solicitação POST.');
      }
      const retorno = await request.json();
      console.log("🚀 ~ file: route.ts:48 ~ POST ~ retorno:", retorno)
      return NextResponse.json(responseData.access_token)
    } else {
      throw new Error('Ocorreu um erro durante a solicitação POST.');
    }

  } catch (error) {
    console.error(error);
    throw error
  }

}