import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { GetPedido } from "./lib/getPedido";
import { UltimoLote } from "./lib/UltimoLote";
import { Lotes } from "./lib/Lotes";
import { PostBling } from "./lib/PostBling";


export async function POST(request: Request, context: { params: any }) {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const Session = await getServerSession(nextAuthOptions);
    const Vendedor: any = Session?.user.name;
    const VendedorId = Session?.user.id;
    const { params } = context;
    const NPedido = params.numero;

    const DataPedido = await GetPedido(NPedido)
    const ultimoLote = await UltimoLote()

    const negocio = DataPedido.attributes.business.data.attributes
 

    if (negocio.andamento === 5 && negocio.etapa === 6) {
      //post lote no php e no strapi
      // const PostLotes = await Lotes(DataPedido,ultimoLote)
      // post Bling
      const BlingPost = await PostBling(DataPedido)
      // console.log("🚀 ~ file: route.ts:31 ~ POST ~ BlingPost:", BlingPost?.status)
      // const getPedido = await PostPedido(data);
      // res.status(200).send(getPedido);
      return NextResponse.json(BlingPost)
    } else {
      return NextResponse.json({ message: "esse negocio nao esta Concluido" },{status: 500});
      // res.status(500).json({ message: "esse negocio nao esta Concluido" });
    }
  } catch (error: any) {
    console.error(error)
    throw !error.response.data.error ? error : error.response.data
  }

}