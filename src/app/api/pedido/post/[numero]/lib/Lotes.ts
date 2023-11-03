import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const requestStrapi = async (Dados: any) => {
  try {
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const request = await fetch(`${url}/lotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Dados),
    });
    const response: any = await request.json();
    const { data } = response

    return data
  } catch (error: any) {
    console.error("erro strapi", !error.response.data.error ? error : error.response.data)
    throw !error.response.data.error ? error : error.response.data
  }
}

const requestPHP = async (Dados: any) => {
  try {
    const Session = await getServerSession(nextAuthOptions);
    const UserEmail: any = Session?.user.email;
    const TokenPhp: any = process.env.NEXT_PUBLIC_RIBERMAX_PHP_TOKEN;
    const urlPHP: any = process.env.NEXT_PUBLIC_RIBERMAX_PHP;

    const request = await fetch(`${urlPHP}/lotes`, {
      method: "POST",
      headers: {
        Token: TokenPhp,
        Email: UserEmail,
      },
      body: Dados,
    });
    
    console.log("🚀 ~ file: Lotes.ts:61 ~ requestPHP ~ request:", request)
   
    if (request.ok) {
      const responseData = await request.json();
      return {
        msg: responseData.message,
        lote: responseData.lotes,
      };
    } else {
      // Handle error response here if needed
      return {
        error: "Ocorreu um erro durante a solicitação POST.",
      };
    }
  } catch (error) {
    console.error("Erro ao fazer a solicitação PHP:", error);
    return null; // Retorna null ou outro valor apropriado em caso de erro
  }
};

export const Lotes = async (dados: any, UltimoLote: number) => {
  try {

    const items = dados.attributes.itens;
    const empresa = dados.attributes.empresaId;
    const empresaCNPJ = dados.attributes.empresa.data.attributes.CNPJ;
    const negocio = dados.attributes.business.data.id;
    const fornecedor = dados.attributes.fornecedorId;
    const fornecedorCNPJ = dados.attributes.fornecedorId.data.attributes.CNPJ;
    const vendedor = dados.attributes.user.data.id;
    const numero = dados.attributes.nPedido;

    const result = await Promise.all(
      items.map(async (i: any, index: number) => {
        const NLote = UltimoLote + index;
        const idCliente = `${i.id}`;

        const postLoteStrapi = {
          data: {
            lote: NLote,
            empresa: empresa,
            empresaId: empresa,
            business: negocio,
            produtosId: i.prodId,
            emitente: fornecedor.data.attributes.titulo,
            emitenteId: fornecedor.data.id,
            qtde: i.Qtd,
            info: "",
            status: "",
            checklist: "",
            logs: "",
            vendedor: vendedor,
            nProposta: numero,
            CNPJClinet: empresaCNPJ,
            CNPJEmitente: fornecedorCNPJ,
            item_id: idCliente
          },
        };

        const formData = new FormData();
        formData.append("cliente[CNPJ]", empresaCNPJ);
        formData.append("emitente[CNPJ]", fornecedorCNPJ);
        formData.append("idProduto", i.prodId);
        formData.append("nLote", NLote.toString());
        formData.append("qtde", i.Qtd);

        const [RetornoStrapi, RetornoPhp] = await Promise.all([
          requestStrapi(postLoteStrapi),
          requestPHP(formData),
        ]);

        return {RetornoStrapi, RetornoPhp};
      })
    );

    return result;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};


