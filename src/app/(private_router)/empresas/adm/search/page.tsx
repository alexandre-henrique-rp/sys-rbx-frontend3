'use client';
import { CarteiraAusente } from "@/components/empresa/carteira/semvededor";
import { CarteiraVendedor } from "@/components/empresa/carteira/vendedor";
import { FiltroEmpresa } from "@/components/empresa/filtro";
import { FiltroEmpresaAdm } from "@/components/empresa/filtroAdm";
import LoadingComponents from "@/components/loading";
import FetchApi from "@/function/fetch/route";
import { processarSemVendedorInteracoes } from "@/function/prossesador/semVendedor";
import { processarVendedorInteracoes } from "@/function/prossesador/vendedor";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { startOfDay } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";



export default function EmpresaSearch() {
  const dataAtual = startOfDay(new Date());
  const { data: session } = useSession();
  const urlSearch = useSearchParams();
  const [RetornoVendedor, setRetornoVendedor] = useState([]);
  const [RetornoSemVendedor, setRetornoSemVendedor] = useState([]);
  const [User, setUser] = useState('');

  if (!urlSearch) {
    redirect('/empresas');
  }

  useEffect(() => {
    (async () => {
      try {
        if (!!urlSearch.get('user')) {
          const value: any = urlSearch.get('user');
          setUser(value);
        }
        const urlVendedor = `/empresas?filters[user][username][$containsi]=${urlSearch.get('user')}&filters[nome][$containsi]=${urlSearch.get('titulo')}&sort[0]=nome%3Aasc&fields[0]=nome&populate[user][fields][0]=username&populate[businesses]=*&populate[interacaos][fields][0]=proxima&populate[interacaos][fields][1]=vendedor_name&populate[interacaos][fields][2]=status_atendimento`;

        const urlSemVendedor = `/empresas?filters[user][username][$null]=true&filters[nome][$containsi]=${urlSearch.get('titulo')}&sort[0]=nome%3Aasc&fields[0]=nome&populate[user][fields][0]=username&populate[businesses]=*&populate[interacaos][fields][0]=proxima&populate[interacaos][fields][1]=vendedor_name&populate[interacaos][fields][2]=status_atendimento`;

        const repostaVendedor = await FetchApi({ url: urlVendedor, method: 'GET', isCache: 'no-store' });
        const retornoVendedor = repostaVendedor.data;
        setRetornoVendedor(retornoVendedor);

        const repostaSemVendedor = await FetchApi({ url: urlSemVendedor, method: 'GET', isCache: 'no-store' });
        const retorno = repostaSemVendedor.data;
        setRetornoSemVendedor(retorno);
      } catch (error) {
        console.log(error);
      }

    })();
  }, [session?.user.name, urlSearch])

  const ListaVendedor = !!RetornoVendedor && processarVendedorInteracoes(dataAtual, RetornoVendedor, session);
  const ListaSemVendedor = !!RetornoSemVendedor && processarSemVendedorInteracoes(dataAtual, RetornoSemVendedor, session);


  return (
    <>
      <Box w={'100%'} h={'100%'} bg={'gray.800'} color={'white'} px={5} py={2} fontSize={'0.8rem'}>
        <Heading size={'lg'}>Empresas</Heading>
        <Flex w={'100%'} py={'1rem'} justifyContent={'space-between'} flexDir={'row'} alignItems={'self-end'} px={6} gap={6} borderBottom={'1px'} borderColor={'white'} mb={'1rem'}>
          <Box>
            <FiltroEmpresaAdm User={User} />
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
  )
}