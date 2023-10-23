import { BaseURL } from "@/function/request";

const GetVendedorConf = async(id: any) => {
  try {
    const response = await BaseURL(`/config-vendas?populate=*&filters[user][id][$eq]=${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default GetVendedorConf;