import { nLote } from "../nLote";


export const Lote = async (numero: string) => {
  const GetLote = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pedidos?populate=*&filters[nPedido][$eq]=${numero}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    },
  });
  const request = await GetLote.json();
  const [pedido] = request.data;
  const items = pedido.attributes.itens;
  const empresa = pedido.attributes.empresaId;
  const empresaCNPJ = pedido.attributes.empresa.data.attributes.CNPJ;
  const negocio = pedido.attributes.business.data.id;
  const fornecedor = pedido.attributes.fornecedorId;
  const fornecedorCNPJ = pedido.attributes.fornecedorId.data.attributes.CNPJ;
  const vendedor = pedido.attributes.user.data.id;
  try {
    const result = [];

    for (const i of items) {
      const NLote = await nLote();
      const idCliente = `${i.id}`
      const postLote = {
        data: {
          lote: NLote,
          empresa: empresa,
          empresaId: empresa,
          business: negocio,
          produtosId: i.prodId,
          emitente: fornecedor.data.attributes.titulo,
          emitenteId: fornecedor.data.id,
          qtde: i.Qtd,
          info: "",
          status: "",
          checklist: "",
          logs: "",
          vendedor: vendedor,
          nProposta: numero,
          CNPJClinet: empresaCNPJ,
          CNPJEmitente: fornecedorCNPJ,
          item_id: idCliente
        },
      };
      const PostLote = await fetch("/lotes",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify(postLote),
      });
      const res = await PostLote.json();
      result.push(res.data);
    }

    return result;
  } catch (error: any) {
    console.log(error.response.data.error);
    throw !error.response.data.error ? error : error.response.data.error;
  }
}