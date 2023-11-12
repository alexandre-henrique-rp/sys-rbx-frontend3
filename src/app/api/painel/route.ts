import { Conclucao } from "./request/conclucaoResponse";
import { DataRetorno } from "./request/dataRetornoResponse";
import { DeadLine } from "./request/deadlineResponse";
import { Calculo } from "./lib/calculo";
import { Relatorio } from "./request/reltorio";
import { getAllDaysOfMonth } from "@/function/DateArry";
import { DataSeparete } from "./lib/dataseparate";
import { NextResponse } from "next/server";
import { UserRecord } from "./request/userRecord";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const DataIncicio: any = searchParams.get("DataIncicio");
    const DataFim: any = searchParams.get("DataFim");
    const Vendedor: any = searchParams.get("Vendedor");

    const date = new Date(DataIncicio);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const conclucaoResponse = await Conclucao(DataIncicio, DataFim, Vendedor)
    const dataRetornoResponse = await DataRetorno(DataIncicio, DataFim, Vendedor);
    const deadlineResponse = await DeadLine(DataIncicio, DataFim, Vendedor);
    const [relatorio] = await Relatorio(month, year, Vendedor);
    const GetAllDay = await getAllDaysOfMonth(month, year);
    const record = await UserRecord(Vendedor);

    const em_aberto_bruto = dataRetornoResponse;
    const perdido_bruto = deadlineResponse;
    const conclusao_bruto = conclucaoResponse;
    const data = conclucaoResponse;


    const em_aberto = Calculo(em_aberto_bruto);
    const conclusao = Calculo(conclusao_bruto);
    const perdido = Calculo(perdido_bruto);

    const DataSeparada = DataSeparete(data, GetAllDay);

    const DataRetono = {
      em_aberto,
      perdido,
      conclusao,
      record,
      data,
      DataSeparada,
      relatorio,
    };
    return NextResponse.json(DataRetono, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(!error.response.data ? error : error.response.data, { status: 500 });
  }
}