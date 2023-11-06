import { NextResponse } from "next/server";
import puppeteer from "puppeteer";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fornecedor: any = searchParams.get('fornecedor');
    const Url: any = fornecedor === 'Bragheto'? process.env.NEXT_BLING_BRAGHETO_URL_AUTH: fornecedor === 'Renato'? process.env.NEXT_BLING_RENATO_URL_AUTH : process.env.NEXT_BLING_RIBERMAX_URL_AUTH;
    
    const response: any = await fetch(Url, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html;charset=utf-8',
      },
      redirect: 'follow'
    })
    if (response.ok) {
      const retorno = await response.url
      let urlTratamento;
      (async () => {
        
        const browser = await puppeteer.launch({ ignoreDefaultArgs: ['--disable-extensions'], headless: false, defaultViewport: null, devtools: false, args: ['--app', `--window-size=${600},${800}`] });
        const page = await browser.newPage();
        
        await page.setViewport({
          width: 600,
          height: 600,
          deviceScaleFactor: 1,
        });
        await page.goto(retorno);
        
        // // Espere até que o login seja concluído e a URL de retorno seja atingida
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        // // Pegue a URL atual após o login
        const currentUrl = page.url();
        console.log('URL atual após o login:', currentUrl);
        urlTratamento = currentUrl
        
        // // Realize ações adicionais após o login
        
        await browser.close();
      })()
      if (urlTratamento) {
        return NextResponse.json(urlTratamento, { status: 200 });
      }
      
    } else {
      throw new Error('Não foi possível autenticar')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
  
}