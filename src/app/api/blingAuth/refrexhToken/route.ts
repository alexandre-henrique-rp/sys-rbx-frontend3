import { NextResponse } from "next/server";
import { savetoken } from "../../lib/savetoken";



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
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', data.refresh);

    const response = await fetch('https://www.bling.com.br/Api/v3/oauth/token', {
      method: 'POST',
      headers,
      body: formData,
    });

    const responseData = await response.json();
    console.log("🚀 ~ file: route.ts:28 ~ POST ~ responseData:", responseData)
    if (responseData.access_token) {
      const date = new Date();
      date.setDate(date.getDate() + 29);
      const DataJson = {
        data: {
          token: responseData.access_token,
          periodo: responseData.expires_in.toString(),
          update: new Date().toISOString(),
        }
      }
      const subRota = data.fornecedor.toLowerCase()
      const salve = await savetoken(DataJson, subRota)

      console.log("🚀 ~ file: route.ts:48 ~ POST ~ retorno:", salve)
      return NextResponse.json(responseData.access_token)
    } else {
      throw new Error('Ocorreu um erro durante a solicitação POST.');
    }

  } catch (error) {
    console.error(error);
    throw error
  }

}