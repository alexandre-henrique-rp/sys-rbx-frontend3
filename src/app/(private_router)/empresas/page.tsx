
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { CarteiraAusente } from "@/components/empresa/carteira/semvededor";
import { CarteiraVendedor } from "@/components/empresa/carteira/vendedor";
import { FiltroEmpresa } from "@/components/empresa/filtro";
import LoadingComponents from "@/components/loading";
import FetchApi from "@/function/fetch/route";
import { processarSemVendedorInteracoes } from "@/function/prossesador/semVendedor";
import { processarVendedorInteracoes } from "@/function/prossesador/vendedor";
import { Box, Button, Flex, FormLabel, Heading, Input, Spinner, useToast } from "@chakra-ui/react";
import { startOfDay } from "date-fns";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";



async function Empresas() {
  const dataAtual = startOfDay(new Date());
  const session = await getServerSession(nextAuthOptions);


  const urlVendedor = `/empresas?filters[user][username][$containsi]=${session?.user.name}&sort[0]=nome%3Aasc&fields[0]=nome&populate[user][fields][0]=username&populate[businesses]=*&populate[interacaos][fields][0]=proxima&populate[interacaos][fields][1]=vendedor_name&populate[interacaos][fields][2]=status_atendimento&pagination[limit]=8000`;

  const urlSemVendedor = `/empresas?filters[user][username][$null]=true&sort[0]=nome%3Aasc&fields[0]=nome&populate[user][fields][0]=username&populate[businesses]=*&populate[interacaos][fields][0]=proxima&populate[interacaos][fields][1]=vendedor_name&populate[interacaos][fields][2]=status_atendimento&pagination[limit]=8000`;

  const repostaVendedor = await FetchApi({ url: urlVendedor, method: 'GET', isCache: 'no-store' });
  const retornoVendedor = repostaVendedor.data;

  const repostaSemVendedor = await FetchApi({ url: urlSemVendedor, method: 'GET', isCache: 'no-store' });
  const retorno = repostaSemVendedor.data;


  const ListaVendedor = processarVendedorInteracoes(dataAtual, retornoVendedor, session);
  const ListaSemVendedor = processarSemVendedorInteracoes(dataAtual, retorno, session);


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
