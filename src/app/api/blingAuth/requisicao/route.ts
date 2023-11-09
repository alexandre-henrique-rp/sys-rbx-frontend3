import { NextResponse } from "next/server";
import puppeteer from "puppeteer";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fornecedor: any = searchParams.get('fornecedor');
    const Url: any = fornecedor === 'Bragheto'? process.env.NEXT_BLING_BRAGHETO_URL_AUTH: fornecedor === 'Renato'? process.env.NEXT_BLING_RENATO_URL_AUTH : process.env.NEXT_BLING_RIBERMAX_URL_AUTH;

    const ID = fornecedor === 'Bragheto'? process.env.NEXT_BLING_BRAGHETO_CLIENTE_ID : fornecedor === 'Renato'? process.env.NEXT_BLING_RENATO_CLIENTE_ID : process.env.NEXT_BLING_RIBERMAX_CLIENTE_ID;

    const Secret = fornecedor === 'Bragheto'? process.env.NEXT_BLING_BRAGHETO_CLIENTE_SECRET: fornecedor === 'Renato'? process.env.NEXT_BLING_RENATO_CLIENTE_SECRET : process.env.NEXT_BLING_RIBERMAX_CLIENTE_SECRET;
    console.log("🚀 ~ file: route.ts:14 ~ GET ~ Secret:", Secret)
    
    const response: any = await fetch(Url, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html;charset=utf-8',
      },
      redirect: 'follow'
    })
    if (response.ok) {
      const retorno = await response.url
      return NextResponse.json({
        url:retorno,
        id: ID,
        secret: Secret
      }, { status: 200 });
      
    } else {
      throw new Error('Não foi possível autenticar')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
  
}