"use client";
import DeleteVendedorConf from "@/app/api/vendedor/ConfgDele";
import GetVendedorConf from "@/app/api/vendedor/getConfg";
import FetchRequest from "@/function/fetch/request/route";
import { BaseURL } from "@/function/request";
import { Box, Flex, Heading, IconButton, Table, TableContainer, Tbody, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";


export const TabelaVendasVendedor = (props: { id: any , update: any}) => {
  const IDVendedor = props.id
  const [Data, setData] = useState<any|null>([]);
  const [Bloq, setBloq] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if(props.update === true){
      (async () => {
        try {
          const request = await FetchRequest.get(`/config-vendas?populate=*&filters[user][id][$eq]=${IDVendedor}`);
          const retorno = request.data.data;
          console.log("🚀 ~ file: index.tsx:22 ~ retorno:", retorno)
          setData(retorno)
          setBloq(false)
        } catch (error) {
          console.log(error);
          setBloq(false)
        }
      })();
    }
    if(IDVendedor && setBloq){
      (async () => {
        try {
          const request = await FetchRequest.get(`/config-vendas?populate=*&filters[user][id][$eq]=${IDVendedor}`);
          const retorno = request.data.data;
          setBloq(false)
          setData(retorno)
        } catch (error) {
          console.log(error);
          setBloq(false)
        }
      })();
    }
  }, [IDVendedor, props.update]);
   
  const DELETE = async(id: any) => {
    try {
     const Deletar = await FetchRequest.delete(`/config-vendas/${id}`);
     const data = Deletar.data.data;
     toast({
       title: 'Sucesso',
       description: 'Configuração deletada com sucesso',
       status: 'success',
       duration: 9000,
       isClosable: true
     })
     console.log(data);
     (async () => {
      try {
        const request = await FetchRequest.get(`/config-vendas?populate=*&filters[user][id][$eq]=${IDVendedor}`);
        const retorno = request.data.data;
        setData(retorno)
      } catch (error) {
        console.log(error);
      }
    })();
    } catch (error: any) {
      console.log(error);
      toast({
        title: 'Erro',
        description: 'Erro ao deletar configuração, erro: ' + !!error.response.data? error.response.data : error,
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
  }

  const ListaTable = Data.map((item: any) => {

    return (
      <>
        <Tr key={item.id}>
          <Th color={'white'}>{item.attributes.ano}</Th>
          <Th color={'white'}>{item.attributes.mes}</Th>
          <Th color={'white'}>{item.attributes.meta_decendio}</Th>
          <Th color={'white'}>{item.attributes.salario_fixo}</Th>
          <Th color={'white'}>{item.attributes.ajuda_de_custo}</Th>
          <Th color={'white'}>{item.attributes.premio_decendio_1}</Th>
          <Th color={'white'}>{item.attributes.premio_decendio_2}</Th>
          <Th color={'white'}>{item.attributes.premio_decendio_3}</Th>
          <Th color={'white'}>{item.attributes.premio_meta_do_mes}</Th>
          <Th color={'white'}>{item.attributes.premio_recorde_de_vendas}</Th>
          <Th color={'white'}>{item.attributes.entradas_atendimento}</Th>
          <Th color={'white'}>{item.attributes.comisao_atendimento}</Th>
          <Th color={'white'}>{item.attributes.entradas_venda}</Th>
          <Th color={'white'}>{item.attributes.comissao_venda}</Th>
          <Th color={'white'}>{item.attributes.entradas_contas}</Th>
          <Th color={'white'}>{item.attributes.comissao_conta}</Th>
          <Th><IconButton colorScheme="red" icon={<FaRegTrashCan />}aria-label="Excluir" onClick={() => DELETE(item.id)} /></Th>
        </Tr>
      </>
    )
  })

  return (
    <>
      <Flex w={'100%'} h={'33%'} flexDir={'column'} p={3} color={'white'} bg={'gray.800'}>
        <Box w={'100%'}>
          <Heading size={'md'} mb={3}>
            Pagamentos
          </Heading>
        </Box>
        <TableContainer overflowY={'auto'} color={'white'} bg={'gray.800'}>
          <Table size='sm' mx={10} mb={15}>
            <Thead bg='#ffffff12' h={10}>
              <Tr>
                <Th color={'white'}>Ano</Th>
                <Th color={'white'}>Mês</Th>
                <Th color={'white'}>Meta decêndio</Th>
                <Th color={'white'}>Salário fixo</Th>
                <Th color={'white'}>Ajuda de custo</Th>
                <Th color={'white'}>Prêmio decêndio 1</Th>
                <Th color={'white'}>Prêmio decêndio 2</Th>
                <Th color={'white'}>Prêmio decêndio 3</Th>
                <Th color={'white'}>Prêmio meta do mês</Th>
                <Th color={'white'}>Prêmio recorde de vendas</Th>
                <Th color={'white'}>Entradas Atendimento</Th>
                <Th color={'white'}>Comissão Atendimento</Th>
                <Th color={'white'}>Entradas Venda</Th>
                <Th color={'white'}>Comissão Venda</Th>
                <Th color={'white'}>Entradas Conta</Th>
                <Th color={'white'}>Comissão Conta</Th>
                <Th color={'white'}>Excluir</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!!Data && ListaTable}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </>
  )
}
