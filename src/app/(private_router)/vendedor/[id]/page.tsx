"use client";
import { ConfigVendedor } from "@/components/vendedor/form/confgVendedor";
import { DadosVendedor } from "@/components/vendedor/form/dadosVendedor";
import { TabelaVendasVendedor } from "@/components/vendedor/form/tabelaVendedor";
import { Box, Divider, Flex } from "@chakra-ui/react";
import { useState } from "react";


interface VendedorIdProps {
  params: {
    id: any
  }
}

export default function VendedorId({ params }: VendedorIdProps) {
 const id: any = params.id
 const [Reset, setReset] = useState(false)

  const handlerUpdate = (update: any) => {
    console.log('teste',update)
    setReset(update)
  }
    
  return (
    <>
      <Flex w={'100%'} h={'100%'} flexDir={'column'} justifyContent={'space-between'} p={1} color={'white'} bg={'gray.800'}>
       
        {/* dados do vendedor */}
        <DadosVendedor id={ id } />
        <Divider />

        {/* configuração de vendas */}
        <ConfigVendedor id={id} DataUpdate={handlerUpdate} />
        <Divider />

        {/* historico de vendas */}
        <TabelaVendasVendedor id={id} update={Reset} />

      </Flex>
    </>
  )


}