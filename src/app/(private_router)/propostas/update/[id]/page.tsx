import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import  FormProposta  from "@/components/propostas/formProposta";
import { Flex } from "@chakra-ui/react";
import { getServerSession } from "next-auth";


interface InfosParams {
  params: {
    id: string;
  }
}

async function GetRequestNegocio(id: string) {
  const BaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const Token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
 const request = await fetch(`${BaseUrl}/businesses/${id}?populate=*`, {
   method: "GET",
   headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${Token}`
   },
   cache: "no-store"
  });
  const response = await request.json();
  return response.data;
}

async function GetRequestProdutos(CNPJ: string) {
  const session = await getServerSession(nextAuthOptions);
  const UserEmail: any = session?.user.email;
  const BaseUrl = process.env.NEXT_PUBLIC_RIBERMAX_PHP;
  const Token = process.env.NEXT_PUBLIC_RIBERMAX_PHP_TOKEN;
 const request = await fetch(`${BaseUrl}/produtos?CNPJ=${CNPJ}&limit=30`, {
   method: "GET",
   headers: {
     "Content-Type": "application/json",
     "Email": `${UserEmail}`,
     "Token": `${Token}`
   },
   cache: "no-store",
 })
 const response = await request.json();
 return response;
}

async function GetRequestProdutosId(id: string) {
  const session = await getServerSession(nextAuthOptions);
  const UserEmail: any = session?.user.email;
  const BaseUrl = process.env.NEXT_PUBLIC_RIBERMAX_PHP;
  const Token = process.env.NEXT_PUBLIC_RIBERMAX_PHP_TOKEN;
 const request = await fetch(`${BaseUrl}/produtos?prodId=${id}`, {
   method: "GET",
   headers: {
     "Content-Type": "application/json",
     "Email": `${UserEmail}`,
     "Token": `${Token}`
   },
   cache: "no-store",
 })
 const response = await request.json();
 return response;
}


async function UpdateProposta ({ params }: InfosParams) {
  const id: any = params.id;
  const Negocio = await GetRequestNegocio(id);
  const CNPJ = Negocio.attributes.empresa.data.attributes.CNPJ;
  const Produtos = await GetRequestProdutos(CNPJ);

  const lista = await Promise.all(
    Produtos.map(async (e: any) => {
      try {
        const request = await GetRequestProdutosId(e.prodId);
        return request;
      } catch (error) {
        console.log(error);
        return [];
      }
    })
  );


  return (
    <>
    <Flex w={'100%'} h={'100%'} p={5} overflow={"auto"} color={'white'} bg={'gray.800'}>
      <FormProposta envio="PUT" data={Negocio} produtos={lista} id={id} />
    </Flex>
    </>
  )
}

export default UpdateProposta;