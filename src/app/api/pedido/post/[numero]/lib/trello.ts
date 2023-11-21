import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { GetLoteProposta } from "./GetLoteProposta";
import { IncidentRecord } from "@/app/api/lib/incidenteRecord";


export const Trello = async (pedido: any, numero: any) => {
  const BaseUrl: any = process.env.TRELLO_BASEURL;
  const token: any = process.env.TRELLO_TOKEN;
  const key: any = process.env.TRELLO_KEY;

  const session = await getServerSession(nextAuthOptions);
  const lote = await GetLoteProposta(numero);

  const items = pedido.attributes.itens;
  const cliente = pedido.attributes.empresa.data.attributes.nome;
  const negocio = pedido.attributes.business.data.attributes.nBusiness;
  const negocioId = pedido.attributes.business.data.id;
  const frete =
    pedido.attributes.frete === "" ? "Fob" : pedido.attributes.frete;
  const pgto = pedido.attributes.condi;
  const Prazo = pedido.attributes.prazo;
  const Bpedido = pedido.attributes.Bpedido;
  const estrega = pedido.attributes.dataEntrega;
  const VendedorName = pedido.attributes.user.data.attributes.username;
  const fornecedorName = pedido.attributes.fornecedorId.data.attributes.nome;
  const pedidoCliente = pedido.attributes.cliente_pedido;

  const Vendedor = session?.user.trello_id;

  const list = "6438073ecc85f294325f74ac"; //teste
  const Bord = "5fac445b3c5274707a309d61";

  //Membros
  const trelloMembers: string[] = [
    "5fd10678fbc6b504679737d4" /*Daniela*/,
    "62a736038685171186013ba4" /*Expedição*/,
    "5d7bbf629972e80b374829bb" /*Fábrica*/,
    `${Vendedor}` /*Vendedor*/,
  ];
  try {
    const promises = items.map(async (i: any, index: number) => {
      const Prenlote = lote
        .filter(
          (f: any) =>
            f.attributes.produtosId == i.prodId &&
            f.attributes.qtde == i.Qtd &&
            f.attributes.item_id == i.id
        )
        .map((p: any) => p.attributes.lote);
      const nlote = Prenlote[0];

      const type =
        i.mont === true && i.expo === false
          ? "MONT"
          : i.mont === false && i.expo === true
          ? "EXP"
          : i.mont === false && i.expo === false
          ? ""
          : "EXP - MONT";

      const nomeCard = `${cliente} - ${i.Qtd} - ${i.nomeProd} - Medidas ${i.comprimento} x ${i.largura} x ${i.altura} - peso ${i.pesoCx}(kg) - ${type} - Lote Nº ${nlote}`;

      const dataBoard = JSON.stringify({
        key: key,
        token: token,
        idList: list,
        boardId: Bord,
        name: nomeCard,
        desc: `Negocio: Nº. ${negocio},
      Proposta: Nº. ${numero},
      Vendedor(a): ${VendedorName},
      Empresa: ${fornecedorName},
      Tipo de frete: ${frete},
      Bling: Nº. ${Bpedido},
      Negocio Id: Nº. ${negocioId},
      Pedido: Nº. ${pedidoCliente === null? '':pedidoCliente},
      Lote: Nº. ${nlote},
      Forma de pagamento: ${pgto},
      ${pgto === 'A Prazo' && (`Prazo de pagamento: ${Prazo}`)}
      Modelo: ${i.modelo}`,
        idMembers: trelloMembers,
        due: estrega+'T16:00:00.000Z',
        dueReminder: 2880,
        pos: "top",
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      const response = await fetch(
        `${BaseUrl}/cards`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: dataBoard,
        }
      );

      const data = await response.json();
      const msgText = `card id: ${data.id} pode ser acessado pelo link: ${data.shortUrl}`;
      const text = {
        msg: msgText,
        date: new Date().toISOString(),
        user: "Sistema",
      };

      await IncidentRecord(text, negocioId);
      return msgText;
      
    });
  } catch (error: any) {
    return error
  }
}