import puppeteer from 'puppeteer';


export const PostBling = async (Dados: any) => {
  try {
    const TokenBragheto: any = 'ae0a0b1b67b5b2524574ad933ec8789be441b433'
    const fornecedor = Dados.attributes.fornecedorId.data.attributes.CNPJ;

    const TokenBling = fornecedor === '04586593000170' ? 'Bragheto' : fornecedor === '30668678000108' ? 'Renato' : 'Ribermax'


    console.log("🚀 ~ file: PostBling.ts:7 ~ PostBling ~ fornecedor:", TokenBling)

    const Data = JSON.stringify({
      "contato": {
        "id": "<integer>",
        "nome": "<string>",
        "tipoPessoa": "F",
        "numeroDocumento": "<string>"
      },
      "data": "<date>",
      "dataPrevista": "<date>",
      "dataSaida": "<date>",
      "itens": [
        {
          "id": "<integer>",
          "quantidade": "<float>",
          "valor": "<float>",
          "descricao": "<string>",
          "codigo": "<string>",
          "unidade": "<string>",
          "desconto": "<float>",
          "aliquotaIPI": "<float>",
          "descricaoDetalhada": "<string>",
        },
      ],
      "parcelas": [
        {
          "id": "<integer>",
          "dataVencimento": "<date>",
          "valor": "<float>",
          "formaPagamento": {
            "id": "<integer>"
          },
          "observacoes": "<string>"
        },
        {
          "id": "<integer>",
          "dataVencimento": "<date>",
          "valor": "<float>",
          "formaPagamento": {
            "id": "<integer>"
          },
          "observacoes": "<string>"
        }
      ],
      "id": "<integer>",
      "numero": "<integer>",
      "numeroLoja": "<string>",
      "totalProdutos": "<float>",
      "total": "<float>",
      "situacao": {
        "id": "<integer>",
        "valor": "<integer>"
      },
      "numeroPedidoCompra": "<string>",
      "outrasDespesas": "<float>",
      "observacoes": "<string>",
      "observacoesInternas": "<string>",
      "desconto": {
        "valor": "<float>",
        "unidade": "REAL"
      },
      "categoria": {
        "id": "<integer>"
      },
      "tributacao": {
        "totalICMS": "<float>",
        "totalIPI": "<float>"
      },
      "vendedor": {
        "id": "<integer>"
      },
    });


    // const response = await fetch('https://www.bling.com.br/Api/v3/pedidos/vendas', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': `Bearer ${TokenBling}`,
    //     'Cookie': 'PHPSESSID=pks7j1krm4n7taorgftsc1oi62'
    //   },
    //   body: Data
    // })

    // const response = await fetch('https://www.bling.com.br/Api/v3/contatos?pagina=1&limite=100&criterio=3', {
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': `Bearer ${TokenBling}`,
    //     'Cookie': 'PHPSESSID=pks7j1krm4n7taorgftsc1oi62'
    //   },
    // })
    const response: any = await fetch('https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=050b7facd85b3eab7df48c932fa41c3cf6033eb9&state=131c984504384bd1b5418de99b0f96cf&scopes=98308+98309+98310+98313+98314+98565+507943+1563512+5990556+106168710+182224097+199272829+200802821+318257553+318257556+318257565+318257568+318257570+318257583+363921589+363921590+363921591+363921592+363953167+363953556+363953706+791588404+1649295804+1869535257+5862218180+6239411327+13645012976+13645012997+13645012998', {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html;charset=utf-8',
      },
      redirect: 'follow'
    })
    let urlTratamento;
    if (response.ok) {
      const retorno = await response.url
      console.log(retorno)


      if (retorno) {
        (async () => {
          
          const browser = await puppeteer.launch({headless: false, defaultViewport: null, devtools: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
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
      }
    }


    return urlTratamento
  } catch (error) {
    console.error(error)
  }

}