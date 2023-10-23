import { Conclucao } from "./request/conclucaoResponse";
import { DataRetorno } from "./request/dataRetornoResponse";
import { DeadLine } from "./request/deadlineResponse";
import { Calculo } from "./lib/calculo";
import { Relatorio } from "./request/reltorio";
import { getAllDaysOfMonth } from "@/function/DateArry";
import { DataSeparete } from "./lib/dataseparate";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const { searchParams } = new URL(request.url);
    const DataIncicio: any = searchParams.get("DataIncicio");
    const DataFim: any = searchParams.get("DataFim");
    const Vendedor: any = searchParams.get("Vendedor");

    const date = new Date(DataIncicio);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const conclucaoResponse = await Conclucao(DataIncicio, DataFim, Vendedor);
    const dataRetornoResponse = await DataRetorno(DataIncicio, DataFim, Vendedor, token);
    const deadlineResponse = await DeadLine(DataIncicio, DataFim, Vendedor, token);
    const relatorio = await Relatorio(DataIncicio, Vendedor, token);
    const GetAllDay = await getAllDaysOfMonth(month, year, token);

    const em_aberto_bruto = dataRetornoResponse;
    const perdido_bruto = deadlineResponse;
    const conclusao_bruto = conclucaoResponse;
    const data = conclucaoResponse;


    const em_aberto = Calculo(em_aberto_bruto);
    const conclusao = Calculo(conclusao_bruto);
    const perdido = Calculo(perdido_bruto);

    const DataSeparada = DataSeparete(data, GetAllDay);

    const meta = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/config-vendas?populate=*&filters[user][username][$eq]=${Vendedor}&filters[mes][$eq]=${month}&filters[ano][$eq]=${year}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!meta.ok) {
      console.log(meta.statusText);
      throw new Error(meta.statusText);
    }
    const metaRetorno = await meta.json();
    const metaResult = metaRetorno.data[0]

    const DataRetono = {
      em_aberto,
      perdido,
      conclusao,
      data,
      DataSeparada,
      relatorio,
      metaResult
    };
    return NextResponse.json(DataRetono, { status: 200 });
  } catch (error) {
    throw error
  }
}