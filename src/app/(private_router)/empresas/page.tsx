
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { CarteiraAusente } from "@/components/empresa/carteira/semvededor";
import { CarteiraVendedor } from "@/components/empresa/carteira/vendedor";
import { FiltroEmpresa } from "@/components/empresa/filtro";
import LoadingComponents from "@/components/loading";
import { processarSemVendedorInteracoes } from "@/function/prossesador/semVendedor";
import { processarVendedorInteracoes } from "@/function/prossesador/vendedor";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { startOfDay } from "date-fns";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";

async function GetInteracoesVendedor() {
  const BaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const Token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const session = await getServerSession
  (nextAuthOptions);
  const dataAtual = startOfDay(new Date());
  try {
    const request = await fetch(`${BaseUrl}/empresas?filters[user][username][$containsi]=${session?.user.name}&sort[0]=nome%3Aasc&fields[0]=nome&populate[user][fields][0]=username&populate[businesses]=*&populate[interacaos][fields][0]=proxima&populate[interacaos][fields][1]=vendedor_name&populate[interacaos][fields][2]=status_atendimento&pagination[limit]=8000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`,
      },
      cache: "no-store"
    })
    const response = await request.json();
    const lista = processarVendedorInteracoes(dataAtual, response.data, session);
    return lista
  } catch (error: any) {
    console.log(error)
    return []
  }
}

async function GetInteracoesSemVendedor() {
  const BaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const Token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const dataAtual = startOfDay(new Date());
  const session = await getServerSession
  (nextAuthOptions);
  try {
    const request = await fetch(`${BaseUrl}/empresas?filters[user][username][$null]=true&sort[0]=nome%3Aasc&fields[0]=nome&populate[user][fields][0]=username&populate[businesses]=*&populate[interacaos][fields][0]=proxima&populate[interacaos][fields][1]=vendedor_name&populate[interacaos][fields][2]=status_atendimento&pagination[limit]=8000`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Token}`,
      },
      cache: "no-store"
    })
    const response = await request.json();
    const lista = processarSemVendedorInteracoes(dataAtual, response.data, session);
    return response.data
  } catch (error: any) {
    console.log(error)
    return []
  }
}

async function Empresas() {

  const ListaVendedor = await GetInteracoesVendedor();
  const ListaSemVendedor = await GetInteracoesVendedor();


  return (
    <>
      <Box w={'100%'} h={'100%'} bg={'gray.800'} color={'white'} px={5} py={2} fontSize={'0.8rem'}>
        <Heading size={'lg'}>Empresas</Heading>
        <Flex w={'100%'} py={'1rem'} justifyContent={'space-between'} flexDir={'row'} alignItems={'self-end'} px={6} gap={6} borderBottom={'1px'} borderColor={'white'} mb={'1rem'}>
          <Box>
            <FiltroEmpresa />
          </Box>
          <Link href={'/empresas/cadastro'} passHref>
            <Button size={'sm'} colorScheme="green">+ Nova Empresa</Button>
          </Link>
        </Flex>
        <Box display={'flex'} flexDirection={{ base: 'column', lg: 'row' }} w={'100%'} h={'76%'} pt={5} gap={5} >
          <Suspense fallback={<LoadingComponents />}>
            <CarteiraVendedor filtro={ListaVendedor} />
          </Suspense>
          <Suspense fallback={<LoadingComponents />}>
            <CarteiraAusente filtro={ListaSemVendedor} />
          </Suspense>
        </Box>
      </Box>
     
    </>
  );
}

export default Empresas;
