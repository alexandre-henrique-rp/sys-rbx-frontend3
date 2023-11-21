import { NextResponse } from "next/server";
import { GetPedido } from "./lib/getPedido";
import { UltimoLote } from "./lib/UltimoLote";
import { Lotes } from "./lib/Lotes";
import { PostBling } from "./lib/PostBling";
import { Trello } from "./lib/trello";


export async function POST(request: Request, context: { params: any }) {
  try {
    const LocalHost = process.env.NEXTAUTH_URL
    const { params } = context;
    const NPedido = params.numero;

    const DataPedido = await GetPedido(NPedido)
    const ultimoLote = await UltimoLote()

    const negocio = DataPedido.attributes.business.data.attributes
    const EmpresaId = DataPedido.attributes.empresa.data.id
 

    if (negocio.andamento === 5 && negocio.etapa === 6) {
      //post lote no php e no strapi
      const PostLotes = await Lotes(DataPedido,ultimoLote)
      // post Bling
      const BlingPost = await PostBling(DataPedido)
      //trello
      const postTrello = await Trello(DataPedido, NPedido)

      const response = await fetch(`${LocalHost}/api/robot/verificVendas?id=${EmpresaId}&valor=${DataPedido.attributes.valor}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        }
      })
      const retorno = await response.json();

      const resolver = Promise.all([PostLotes, BlingPost, postTrello, retorno]);

      return NextResponse.json(resolver, { status: 200 });
    } else {
      return NextResponse.json({ message: "esse negocio nao esta Concluido" },{status: 400});
    }
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(!error.response.data.error ? error : error.response.data, { status: 500 });
  }

}