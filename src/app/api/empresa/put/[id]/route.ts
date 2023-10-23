import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";
import { LogEmpresa } from "../../lib/logEmpresa";
import { NextResponse } from "next/server";


export async function PUT(request: Request, context: { params: any }) {
  try {
    const { params } = context;
    const ID = params.id
    const data: any = await request.json();
    const token: any = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const TokenPhp: any = process.env.NEXT_PUBLIC_RIBERMAX_PHP_TOKEN;
    const url: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const urlPHP: any = process.env.NEXT_PUBLIC_RIBERMAX_PHP;
    const Session = await getServerSession(nextAuthOptions);
    const email: any = Session?.user.email;
    const Vendedor: any = Session?.user.name;

    const response = await fetch(`${url}/empresas/${ID}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const retorno = await response.json();

    const LogRegister = await LogEmpresa(retorno.data.id, "cadastro", Vendedor);
    console.log('registro de log Put',LogRegister);

    // Data for the second API
    const DataRbx = {
      nome: data.data.nome,
      email: data.data.email,
      xNome: data.data.fantasia,
      CNPJ: data.data.CNPJ,
      IE: data.data.Ie,
      IM: "",
      fone: data.data.cidade,
      indIEDest: "",
      CNAE: data.data.CNAE,
      xLgr: data.data.endereco,
      nro: data.data.numero,
      xCpl: data.data.complemento,
      cMun: "",
      cPais: data.data.codpais,
      xPais: data.data.pais,
      xBairro: data.data.bairro,
      CEP: data.data.cep,
      xMun: data.data.cidade,
      UF: data.data.uf,
      ativo: data.data.status !== true ? "" : "1",
      tabela: data.data.tablecalc,
      ultima_compra: "",
      LatAdFrSN: data.data.adFrailLat === true ? "on" : "off",
      CabAdFrSN: data.data.adFrailCab === true ? "on" : "off",
      LatAdExSN: data.data.adEspecialLat === true ? "on" : "off",
      CabAdExSN: data.data.adEspecialCab === true ? "on" : "off",
      LatForaSN: data.data.latFCab === true ? "on" : "off",
      CabChaoSN: data.data.cabChao === true ? "on" : "off",
      CabTopoSN: data.data.cabTop === true ? "on" : "off",
      caixa_economica: data.data.cxEco === true ? "on" : "off",
      caixa_estruturada: data.data.cxEst === true ? "on" : "off",
      caixa_leve: data.data.cxLev === true ? "on" : "off",
      caixa_reforcada: data.data.cxRef === true ? "on" : "off",
      caixa_resistente: data.data.cxResi === true ? "on" : "off",
      caixa_super_reforcada: data.data.cxSupRef === true ? "on" : "off",
      engradado_economico: data.data.engEco === true ? "on" : "off",
      engradado_leve: data.data.engLev === true ? "on" : "off",
      engradado_reforcado: data.data.engRef === true ? "on" : "off",
      engradado_resistente: data.data.engResi === true ? "on" : "off",
      palete_sob_medida: data.data.platSMed === true ? "on" : "off",
      modelo_especial: data.data.modEsp === true ? "on" : "off",
      formaPagto: data.data.forpg,
      prefPagto: data.data.maxPg,
      frete: data.data.frete === "" ? "fob" : data.data.frete,
    };

    const CNPJ = data.data.CNPJ;
    const dataExclui = { CNPJ: CNPJ };
    let RetornoPhp;

    if (data.data.status === false) {
      const DeletePhp = await fetch(`${urlPHP}/empresas`, {
        method: 'POST',
        headers: {
          Email: email,
          Token: TokenPhp,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(dataExclui),
      });
      RetornoPhp = await DeletePhp.json();
      
    } else {
      const responsePhp = await fetch(`${urlPHP}/empresas`, {
        method: 'PUT',
        headers: {
          Email: email,
          Token: TokenPhp,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(DataRbx),
      });
  
      RetornoPhp = await responsePhp.json();

    }

    return NextResponse.json({message: 'Cliente Atualizado com sucesso', data: { strapi: retorno.data, php: RetornoPhp}}, { status: 200 });

  } catch (error) {
    console.error(error)
    throw error
  }
}