import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const BaseUrl: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const Session = await getServerSession(nextAuthOptions);
  const vendedor: any = Session?.user.name;
  const VendedorId = Session?.user.id;

  const { searchParams } = new URL(request.url);
  const EmpresaId: any = searchParams.get("id");
  const Valor: any = searchParams.get("valor");

  try {
    const verifique = await fetch(`${BaseUrl}/empresas/${EmpresaId}?populate=%2A`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    })
    
    const VerifiqueData = await verifique.json();
    const empresa = VerifiqueData.data;
    const inativStatus = empresa.attributes.inativStatus;
    const ultima_compra = empresa.attributes.ultima_compra;

    const update = {
      data: {
        vendedor,
        user: Number(VendedorId),
        inativStatus,
        ultima_compra: new Date().toISOString(),
        valor_ultima_compra: Valor,
        penultima_compra: ultima_compra,
      },
    };

    if (!inativStatus || inativStatus == 3) {
      update.data.inativStatus = 3;
    } else if (inativStatus == 1 || inativStatus == 4) {
      update.data.inativStatus = 4;
    } else if (inativStatus === 2 || inativStatus === 5) {
      update.data.penultima_compra = ultima_compra;
    }

    if (inativStatus === 2 || inativStatus === 5) {
      const response =await fetch(
        `${BaseUrl}/empresas/${EmpresaId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              ultima_compra: update.data.ultima_compra,
              valor_ultima_compra: update.data.valor_ultima_compra,
              penultima_compra: ultima_compra,
            },
          }),
        }
      );
      const data = await response.json();
      return NextResponse.json(data.data, { status: 200 });

    }

    const response = await fetch(
      `${BaseUrl}/empresas/${EmpresaId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      }
    );

    const data = await response.json();
    return NextResponse.json(data.data, { status: 200 });
  } catch (error: any) {
    console.log(!error.response.data.erro ? error : error.response.data.erro);
    return NextResponse.json({ error: !error.response.data.erro ? error : error.response.data.erro }, { status: 500 });
  }
}