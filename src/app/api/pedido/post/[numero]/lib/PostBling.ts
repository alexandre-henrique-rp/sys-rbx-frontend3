


export const PostBling = async (Dados: any) => {
  
  const fornecedor = Dados.attributes.fornecedorId.data.attributes.CNPJ;

  const TokenBling = fornecedor === '04586593000170' ? 'Bragheto' : fornecedor === '30668678000108' ? 'Renato' : 'Ribermax'

  
  console.log("🚀 ~ file: PostBling.ts:7 ~ PostBling ~ fornecedor:", TokenBling)
}