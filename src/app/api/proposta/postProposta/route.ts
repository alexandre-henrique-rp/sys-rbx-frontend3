import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";
import { Lote } from "./api/lote";
import { LoteRibermax } from "./api/loteRibermax";




export async function POST(request: Request) {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const Session = await getServerSession(nextAuthOptions);
    const data: any = await request.json();
    const email: any = Session?.user.email;
    const Vendedor: any = Session?.user.name;
    const searchParams = new URL(request.url).searchParams;
    const Pedido: any = searchParams.get('Pedido');
    const EmpresaId: any = searchParams.get('EmpresaId');

    const lote = await Lote(Pedido)
    const lotePhp = await LoteRibermax(Pedido)



  } catch (error) {
    throw error
  }
}