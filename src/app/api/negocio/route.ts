import FetchRequest from "@/function/fetch/request/route";
import { DataRequeste } from "./lib/dataRequest";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  try {
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const { searchParams } = new URL(request.url);
    const DataIncicio: any = searchParams.get("DataIncicio");
    const DataFim: any = searchParams.get("DataFim");
    const Vendedor: any = searchParams.get("Vendedor");

    const conclucaoResponse = await DataRequeste(
      `/businesses?filters[vendedor][username][$eq]=${Vendedor}&filters[status][$eq]=true&filters[date_conclucao][$between]=${DataIncicio}&filters[date_conclucao][$between]=${DataFim}&sort[0]=id%3Adesc&fields[0]=deadline&fields[1]=createdAt&fields[2]=DataRetorno&fields[3]=date_conclucao&fields[4]=nBusiness&fields[5]=andamento&fields[6]=Budget&fields[7]=etapa&populate[empresa][fields][0]=nome&populate[vendedor][fields][0]=username&populate[pedidos][fields][0]=totalGeral`
      );

    const dataRetornoResponse = await DataRequeste(
      `/businesses?filters[vendedor][username][$eq]=${Vendedor}&filters[status][$eq]=true&filters[DataRetorno][$between]=${DataIncicio}&filters[DataRetorno][$between]=${DataFim}&sort[0]=id%3Adesc&fields[0]=deadline&fields[1]=createdAt&fields[2]=DataRetorno&fields[3]=date_conclucao&fields[4]=nBusiness&fields[5]=andamento&fields[6]=Budget&fields[7]=etapa&populate[empresa][fields][0]=nome&populate[vendedor][fields][0]=username&populate[pedidos][fields][0]=totalGeral`
      );

    const deadlineResponse = await DataRequeste(
      `/businesses?filters[vendedor][username][$eq]=${Vendedor}&filters[status][$eq]=true&filters[deadline][$between]=${DataIncicio}&filters[deadline][$between]=${DataFim}&sort[0]=id%3Adesc&fields[0]=deadline&fields[1]=createdAt&fields[2]=DataRetorno&fields[3]=date_conclucao&fields[4]=nBusiness&fields[5]=andamento&fields[6]=Budget&fields[7]=etapa&populate[empresa][fields][0]=nome&populate[vendedor][fields][0]=username&populate[pedidos][fields][0]=totalGeral`
      );

    const createdAtResponse = await DataRequeste(
      `/businesses?filters[vendedor][username][$eq]=${Vendedor}&filters[status][$eq]=true&filters[createdAt][$between]=${DataIncicio}&filters[createdAt][$between]=${DataFim}&sort[0]=id%3Adesc&fields[0]=deadline&fields[1]=createdAt&fields[2]=DataRetorno&fields[3]=date_conclucao&fields[4]=nBusiness&fields[5]=andamento&fields[6]=Budget&fields[7]=etapa&populate[empresa][fields][0]=nome&populate[vendedor][fields][0]=username&populate[pedidos][fields][0]=totalGeral`
      );

    const data = [
      ...conclucaoResponse.data,
      ...dataRetornoResponse.data,
      ...deadlineResponse.data,
      ...createdAtResponse.data,
    ];

    // Remover IDs duplicados
    const uniqueData = data.reduce((acc, obj) => {
      if (!acc[obj.id]) {
        acc[obj.id] = obj;
      }
      return acc;
    }, {});

    const sortedData = Object.values(uniqueData);

    sortedData.sort((objetoA: any, objetoB: any) => {
      if (objetoA.id < objetoB.id) {
        return 1;
      } else if (objetoA.id > objetoB.id) {
        return -1;
      } else {
        return 0;
      }
    });
 
    return NextResponse.json(sortedData, { status: 200 });
  } catch (error: any) {
    throw error;
  }
}
