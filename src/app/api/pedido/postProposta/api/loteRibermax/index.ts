import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { ErroPHP } from "../erroPhp";



export const LoteRibermax = async (nPedido: string) => {
  const Session = await getServerSession(nextAuthOptions);
  const EmailUser: any = Session?.user.email;
  const token: any = process.env.NEXT_PUBLIC_RIBERMAX_PHP_TOKEN;

  const loteRequest = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/pedidos?populate=*&filters[nPedido][$eq]=${nPedido}`, {
    headers: {
      Authorization: `Bearer ${process.env.ATORIZZATION_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const retorno = await loteRequest.json();
  const lote = retorno.data;

  const items = lote;
  const promessas = [];

  for (const i of items) {
    try {
      const formData = new FormData();
      formData.append("cliente[CNPJ]", i.attributes.CNPJClinet);
      formData.append("emitente[CNPJ]", i.attributes.CNPJEmitente);
      formData.append("idProduto", i.attributes.produtosId);
      formData.append("nLote", i.attributes.lote);
      formData.append("qtde", i.attributes.qtde);
  
      const promessa = await fetch(`${process.env.NEXT_PUBLIC_RIBERMAX_PHP}/lotes`, {
        method: 'POST',
        headers: {
          Email: EmailUser,
          Token: token,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData,
      });

      const response = await promessa.json();
      if(promessa.ok){
        return {
          msg: await response.data.message,
          lote: await response.data.lotes,
        };
      }


      
    } catch (error) {
      const data = {
        log: {
          "cliente[CNPJ]": i.attributes.CNPJClinet,
          "emitente[CNPJ]": i.attributes.CNPJEmitente,
          idProduto: i.attributes.produtosId,
          nLote: i.attributes.lote,
          qtde: i.attributes.qtde,
          pedido: nPedido,
          error: error,
        },
      };
      return await ErroPHP(data)

    }
  }
}
