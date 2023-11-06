import FetchRequest from "@/function/fetch/request/route";
import axios from "axios";

export const RegCompra = async (id: number, valor: string) => {
  try {
    const bodyData = {
      data: {
        ultima_compra: new Date().toISOString().slice(0, 10),
        valor_ultima_compra: valor,
      },
    };

    const response = await FetchRequest.put(`/empresas/${id}`, bodyData);
    console.log(response.data);
  } catch (error: any) {
    console.log(error.response.data);
  }
};
