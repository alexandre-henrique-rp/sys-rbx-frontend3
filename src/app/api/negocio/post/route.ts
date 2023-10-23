import FetchRequest from "@/function/fetch/request/route";
import { Historico } from "../../lib/historico/route";
import { RegCompra } from "../../lib/RegistroDeCpmpra/route";


const PostNegocios = async (data: any) => {
  try {
    const consulta = await FetchRequest.get(
      "/businesses?fields[0]=id&fields[1]=nBusiness&sort=id%3Adesc"
    );
    const [respostaConsulta] = !consulta.data ? null : consulta.data;
    const resposta =
      respostaConsulta === null
        ? "001"
        : respostaConsulta === undefined
          ? "001"
          : respostaConsulta.attributes.nBusiness;
    const dateNow = new Date();
    const anoVigente = dateNow.getFullYear();
    const resto = resposta.toString().replace(anoVigente, "");
    const restoInt = parseInt(resto) + 1;
    const newResto =
      restoInt < 10
        ? "000" + restoInt
        : restoInt > 99
          ? "00" + restoInt
          : restoInt > 999
            ? "0" + restoInt
            : restoInt;
    const newNuber = anoVigente.toString() + newResto;
    const newBusinesses = Number(newNuber);

    const nBusiness = !respostaConsulta
      ? Number(anoVigente + "000" + 1)
      : newBusinesses;

    const getVendedor = await FetchRequest.get("/users/" + data.vendedor);
    const respVendedor = getVendedor.data.username;

    const getCliente = await FetchRequest.get("/empresas/" + data.empresa);
    const respCliente = getCliente.data.attributes.nome;

    const dataAtualizado = {
      data: {
        status: true,
        statusAnd: "Ativo",
        DataRetorno: data.DataRetorno,
        nBusiness: nBusiness.toString(),
        Budget: data.Budget,
        Approach: data.Approach,
        history: [data.history],
        incidentRecord: data.incidentRecord,
        empresa: Number(data.empresa),
        vendedor: data.vendedor,
        vendedor_name: data.vendedor_name,
        andamento: 3,
        etapa: 2,
      },
    };

    const response = await FetchRequest.post(`/businesses`, dataAtualizado)

    console.log(response.data);
    const isoDateTime = new Date().toISOString();
    const VisibliDateTime = new Date().toISOString();
    await RegCompra(Number(data.empresa), data.Budget)

    const txt = {
      date: isoDateTime,
      vendedor: data.vendedor,
      msg: `Business numero: ${nBusiness}, foi criado pelo vendedor ${respVendedor} para o cliente ${respCliente} no dia ${VisibliDateTime}`,
    };
    const url = `empresas/${data.empresa}`;
    const Register = await Historico(txt, url);

    return {
      status: 200,
      nBusiness: response.data.data.id,
      message: `Business numero: ${nBusiness}, foi criado pelo vendedor ${respVendedor} para o cliente ${respCliente} no dia ${VisibliDateTime}`,
      historico: Register,
    };
  } catch (error: any) {
    console.log(error.response);
    const isoDateTime = new Date().toISOString();

    const txt = {
      date: isoDateTime,
      vendedor: data.vendedor,
      msg: "Proposta não foi criada devido a erro",
      error: error.response,
    };
    const url = `empresas/${data.empresa}`;
    const Register = await Historico(txt, url);

    const ErroJson ={
      historico: Register,
      error: error.response,
      message: error.response,
    };
    console.log("🚀 ~ file: route.ts:98 ~ PostNegocios ~ ErroJson:", ErroJson)

    return error;
  }
}

export default PostNegocios;