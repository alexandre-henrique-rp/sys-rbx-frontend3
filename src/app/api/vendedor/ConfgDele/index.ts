import { BaseURL } from "@/function/request";

const DeleteVendedorConf = async(id: any) => {
  try {
    const response = await BaseURL(`/config-vendas/${id}`,{
      method: 'DELETE'
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default DeleteVendedorConf;