'use client';
import { Box, Flex, Heading } from "@chakra-ui/react"
import { FaMoneyBillAlt } from "react-icons/fa";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";

interface FiltroProps {
  filtro: any
}

export const CarteiraAusente = ({ filtro }: FiltroProps) => {
  const [Data, setData] = useState([]);
  const { data: session } = useSession();
  const PathN = usePathname();


  useEffect(() => {
    if (session?.user.pemission === 'Adm' && PathN == '/empresas') {
      redirect('/empresas/adm')
    }
    
    if (filtro) {
      setData(filtro)
    }
  }, [PathN, filtro, session?.user.pemission])


  const BodyTabela = Data.map((i: any) => {

    const negocio = i.attributes.businesses.data.length > 0 ? i.attributes.businesses.data : []

    const iconeTest = negocio.filter((n: any) => {
      if (n.attributes.andamento === 3 && n.attributes.etapa !== 6 && n.attributes.vendedor_name == session?.user?.name) {
        return true
      } else {
        return false
      }
    });

    const interacao = i.attributes.interacaos.data

    return (
      <>
        <tr key={i.id} style={{ borderBottom: '1px solid #ffff' }}>
          <Link key={i.id} href={`/empresas/id/${i.id}`} style={{ textDecoration: 'none' }}>
            <td style={{ padding: '0.3rem 1.2rem' }}>{i.attributes.nome}</td>
          </Link>
          <td style={{ padding: '0.3rem 1.2rem' }}>{!!interacao && (
            <Flex w={'100%'} justifyContent={'center'}>
              {i.attributes.interacaos.data.length === 0 ? null : (<HiChatBubbleLeftRight color={!interacao.cor ? '#1A202C' : interacao.cor} fontSize={'1.5rem'} />)}
            </Flex>
          )}</td>
          <td style={{ padding: '0.3rem 1.2rem' }}>{iconeTest.length > 0 && (
            <Flex w={'100%'} justifyContent={'center'}>
              <FaMoneyBillAlt color={'green'} fontSize={'1.5rem'} />
            </Flex>
          )}</td>
        </tr>
      </>
    )
  })

  return (
    <>
      <Box color={'white'} w={{ base: '100%', lg: '50%' }}>
        <Heading size={'lg'}>Empresas sem carteira definida</Heading>
        <Box
          mt={5}
          maxH={{ base: '23rem', lg: '90%' }}
          pe={3}
          overflow={'auto'}
        >
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: '#ffffff12', borderBottom: '1px solid #ffff' }}>
                <th style={{ padding: '0.6rem 1.2rem', textAlign: 'start', width: '45%' }}>Nome</th>
                <th style={{ padding: '0.6rem 1.2rem', textAlign: 'start', width: '6%' }}>Interações</th>
                <th style={{ padding: '0.6rem 1.2rem', textAlign: 'start', width: '6%' }}>Negocios</th>
              </tr>
            </thead>
            <tbody>
              {!!Data && BodyTabela}
            </tbody>
          </table>
        </Box>
      </Box>
    </>
  )
}
