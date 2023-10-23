'use client';
import { EtapasNegocio } from "@/data/etapaNegocio";
import { Box, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr, chakra, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { Ausente } from "../ausente/page";
import { useRouter } from "next/router";
// import Loading from "@/components/elements/loading";
import { useSession } from "next-auth/react";
import { NovoCliente } from "../novoCliente/page";
import { Presente } from "../presnte";
import { SelectUser } from "@/components/painel/selectUser";
import { SelectEmpresas } from "@/components/geral/SelectEmpresa";
import { BtCreate } from "@/components/geral/BtCreate";
import { StatusAndamento } from "@/data/statusAndamento";
import { SetValue } from "@/function/setValue";
import Loading from "@/app/loading";

export async function handleRequest(uer: string) {
  try {
    const dataAtual = new Date();
    const primeiroDiaTresMesesAtras = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 3, 1);
    const ultimoDiaMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 3, 0);

    const request = await fetch(`src/app/api/negocio?DataIncicio=${primeiroDiaTresMesesAtras.toISOString()}&DataFim=${ultimoDiaMesAtual.toISOString()}&Vendedor=${uer}`)
    const response = await request.json()

    const filtro = response.filter((c: any) => c.attributes.etapa !== 6 && c.attributes.andamento !== 5)
    return filtro;

  } catch (error: any) {
    console.log(error);
  }
}


export const PowerBi = () => {
  const router = useRouter()
  const { data: session } = useSession();
  const [data, setData] = useState([])
  const [User, setUser] = useState('')
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    setLoad(true);
    const user: any = session?.user.name
    setUser(user)
    handleRequest(user)
    setLoad(true);
  }, [session?.user.name]);


  function handleUserChange(user: React.SetStateAction<any>) {
    setLoad(true);
    const usuario = user
    setUser(usuario)
    handleRequest(usuario)
    setLoad(false);
  }

  function handleEnpresa(enpresa: React.SetStateAction<any>) {
    setLoad(true);
    if (enpresa.length > 0) {
      setData(enpresa)
      setLoad(false)
    } else {
      handleRequest(User)
      setLoad(false);
    }
  }

  function handleLoad(event: any) {
    setLoad(event)
  }

  if (load) {
    return (
      <>
        <Box w={'100%'} h={'100%'}>
          <Loading />
        </Box>
      </>
    );
  }

  return (
    <>
      <Box w={'100%'}>
        <Flex px={5} mt={5} mb={10} justifyContent={'space-between'} w={'100%'}>
          <Flex gap={16}>
            <Box>
              <SelectUser onValue={handleUserChange} user={User} />
            </Box>
            <Box>
              <SelectEmpresas Usuario={User} onValue={handleEnpresa} />
            </Box>
          </Flex>

          <BtCreate user={User} onLoading={handleLoad} />

        </Flex>
        <Box w='100%' display={{ lg: 'flex', sm: 'block' }} p={{ lg: 3, sm: 5 }}>
          <Box w={{ lg: '68%', sm: '100%' }} bg={'#ffffff12'} px={4} rounded={5}>

            <Flex direction={'column'} w={'100%'} my='5'>
              <chakra.span fontSize={'20px'} fontWeight={'medium'} color={'white'}>Funil de vendas</chakra.span>
            </Flex>
            <Box>
              <TableContainer pb='2'>
                <Table variant='simple'>
                  <Thead bg={'gray.600'}>
                    <Tr>
                      <Th color={'white'} textAlign={'center'} borderBottom={'none'} w={'20px'}>Empresa</Th>
                      <Th color={'white'} textAlign={'center'} borderBottom={'none'} w={'5rem'}>Etapa</Th>
                      <Th color={'white'} textAlign={'center'} borderBottom={'none'} w={'5rem'}>Status</Th>
                      <Th color={'white'} textAlign={'center'} borderBottom={'none'} w={'5rem'}>Valor</Th>
                      <Th color={'white'} textAlign={'center'} borderBottom={'none'} w={'5rem'}>Retornar em</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((itens: any) => {
                      const statusAtual = itens.attributes.andamento
                      const [statusRepresente] = StatusAndamento.filter((i: any) => i.id == statusAtual).map((e: any) => e.title);
                      const etapa = EtapasNegocio.filter((e: any) => e.id == itens.attributes.etapa).map((e: any) => e.title)

                      const colorLine = itens.attributes.DataRetorno <= new Date().toISOString() ? 'red.600' : '';

                      const dataDed = new Date(itens.attributes.DataRetorno)
                      dataDed.setDate(dataDed.getDate() + 1);
                      const dataFormatada = dataDed.toLocaleDateString('pt-BR');

                      return (
                        <>
                          <Tr key={itens.id} onClick={() => router.push(`/negocios/${itens.id}`)} cursor={'pointer'}>
                            <Td color={'white'} w={'20px'} p={2} textAlign={'center'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'}>{itens.attributes.empresa.data?.attributes.nome}</Td>
                            <Td color={'white'} fontSize={'12px'} p={2} textAlign={'center'} borderBottom={'1px solid #CBD5E0'}>{etapa}</Td>
                            <Td color={'white'} fontSize={'12px'} p={2} textAlign={'center'} borderBottom={'1px solid #CBD5E0'}>{statusRepresente}</Td>
                            <Td color={'white'} fontSize={'12px'} p={2} textAlign={'center'} borderBottom={'1px solid #CBD5E0'}>{SetValue(itens.attributes.Budget)}</Td>
                            <Td color={'white'} bg={colorLine} p={2} textAlign={'center'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'}>{dataFormatada}</Td>
                          </Tr>
                        </>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>

          </Box>
          <Flex w={{ lg: '30%', sm: '100%' }} p={{ lg: 3, sm: 1 }} gap={{ lg: 3, sm: 1 }} direction={'column'}>
            <Box w={'100%'} bg={'red.600'} p={2} rounded={5}>
              <Flex direction={'column'} w={'100%'}>
                <chakra.span fontSize={'20px'} fontWeight={'medium'} color={'white'}>Clientes em Inatividade</chakra.span>
              </Flex>
              <Box>
                <TableContainer>
                  <Table>
                    <Thead bg={'red.400'}>
                      <Tr>
                        <Th color='white' border={'none'} w={{ sm: '60%', lg: '40%' }} textAlign={'center'}>Empresa</Th>
                        <Th color='white' border={'none'} textAlign={'center'}>última compra</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Ausente user={User} />
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            <Box w={'100%'} bg={'green.600'} p={2} rounded={5}>
              <Flex direction={'column'} w={'100%'}>
                <chakra.span fontSize={'20px'} fontWeight={'medium'} color={'white'}>Clientes novos</chakra.span>
              </Flex>
              <Box>
                <TableContainer>
                  <Table>
                    <Thead bg={'green.500'}>
                      <Tr>
                        <Th color={'white'} border={'none'} w={{ sm: '60%', lg: '40%' }} textAlign={'center'}>Empresa</Th>
                        <Th color={'white'} border={'none'} textAlign={'center'}>Data de entrada</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <NovoCliente user={User} />
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>

            </Box>
            <Box w={'100%'} bg={'blue.600'} p={2} rounded={5}>
              <Flex direction={'column'} w={'100%'}>
                <chakra.span fontSize={'20px'} fontWeight={'medium'} color={'white'}>Clientes recuperados</chakra.span>
              </Flex>
              <Box>
                <TableContainer>
                  <Table>
                    <Thead bg={'blue.400'}>
                      <Tr>
                        <Th color={'white'} border={'none'} textAlign={'center'}>Empresa</Th>
                        <Th color={'white'} border={'none'} textAlign={'center'}>valor de compra</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Presente user={User} />
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
