
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

    return TokenBling
  } catch (error) {
    console.error(error)
  }

}