'use client';

import { CarteiraAusente } from "@/components/empresa/carteira/semvededor";
import { CarteiraVendedor } from "@/components/empresa/carteira/vendedor";
import { FiltroEmpresaAdm } from "@/components/empresa/filtroAdm";
import LoadingComponents from "@/components/loading";
import { SelectUser } from "@/components/painel/selectUser";
import FetchApi from "@/function/fetch/route";
import { processarSemVendedorInteracoes } from "@/function/prossesador/semVendedor";
import { processarVendedorInteracoes } from "@/function/prossesador/vendedor";
import { Box, Button, Flex, Heading, useToast } from "@chakra-ui/react";
import { startOfDay } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter, usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export async function GetVendedor(vendedor: string) {
  const request = await fetch(`/api/empresa/adm/user?user=${vendedor}`);
  const response = await request.json();
  return response;
}

export async function GetSemVendedor() {
  const request = await fetch(`/api/empresa/adm/livre`);
  const response = await request.json();
  return response;
}

export default function EmpresasAdm() {
  const dataAtual = startOfDay(new Date());
  const { data: session } = useSession();
  const pathN = usePathname();
  const [User, setUser] = useState('')
  const [RetornoVendedor, setRetornoVendedor] = useState([]);
  const [RetornoSemVendedor, setRetornoSemVendedor] = useState([]);
  const toast = useToast();

  if (session?.user.pemission != 'Adm' && pathN == '/empresas/adm') {
    redirect('/empresas');
  }

  useEffect(() => {
    (async () => {
      try {
        if (!!session?.user.name && !User) {
          setUser(session?.user.name);
        }
        const vendedor: any = session?.user.name;;
        const retorno = await GetSemVendedor();
        setRetornoSemVendedor(retorno);
        const retornoVendedor = await GetVendedor(vendedor);
        setRetornoVendedor(retornoVendedor);
      } catch (error) {
        console.log(error);
        toast({
          title: 'Opss.',
          description: `Ocorreu um erro inesperado: \n${JSON.stringify(error, null, 2)}`,
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })

      }
    })();
  }, [User, session?.user.name, toast])

  
    async function handleUserChange(user: string) {
      try {
        setUser(user);
        const retornoVendedor = await GetVendedor(user);
        setRetornoVendedor(retornoVendedor);
      } catch (error) {
        console.log(error); 
        toast({
          title: 'Opss.',
          description: `Ocorreu um erro inesperado: \n${JSON.stringify(error, null, 2)}`,
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })      
      }
    }
    
  const ListaVendedor = !!RetornoVendedor && processarVendedorInteracoes(dataAtual, RetornoVendedor, session);
  const ListaSemVendedor = !!RetornoSemVendedor && processarSemVendedorInteracoes(dataAtual, RetornoSemVendedor, session);

  return (
    <>
      <Box w={'100%'} h={'100%'} bg={'gray.800'} color={'white'} px={5} py={2} fontSize={'0.8rem'}>
        <Heading size={'lg'}>Empresas</Heading>
        <Flex w={'100%'} py={'1rem'} justifyContent={'space-between'} flexDir={'row'} alignItems={'self-end'} px={6} gap={6} borderBottom={'1px'} borderColor={'white'} mb={'1rem'}>
          <Box>
          <SelectUser onValue={handleUserChange} user={User} />
          </Box>
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
  );
}