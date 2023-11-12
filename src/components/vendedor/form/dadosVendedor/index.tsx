"use client";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Select, useToast } from "@chakra-ui/react"
import { ReactNode, useEffect, useState } from "react"

interface DadosVendedorProps {
  id: ReactNode
}

async function GetRequest(id: string) {
  const request = await fetch(`/api/user/get/${id}`)
  const response = await request.json();
  return response;
}

async function PutRequest(id: string, dados: any) {
  const request = await fetch(`/api/user/put/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
  const response = await request.json();
  return response;
}


export const DadosVendedor = ({ id }: DadosVendedorProps) => {
  const IDVendedor = id
  const [Nome, setNome] = useState('');
  const [Email, setEmail] = useState('');
  const [Telefone, setTelefone] = useState('');
  const [Recorde, setRecorde] = useState('');
  const [Status, setStatus] = useState('');
  const toast = useToast();
  const [Bloq, setBloq] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await GetRequest(`${IDVendedor}`)
        setNome(response.username);
        setEmail(response.email);
        setTelefone(response.tel);
        setRecorde(response.record);
        setStatus(response.confirmed);
      } catch (error: any) {
        console.log(error);
      }
    })()
  }, [IDVendedor]);


  const salvar = async () => {
    setBloq(true);
    try {
      const Data = {
        username: Nome,
        nome: Nome,
        email: Email,
        setor: "Vendas",
        pemission: "User",
        tel: Telefone,
        record: Recorde,
        confirmed: Status == 'true' ? true : false
      };

      const request = await PutRequest(`${IDVendedor}`, Data);

      const resposta = request;
      if(!!resposta){
        console.log(resposta);
        toast({
          title: 'Salvo com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        setBloq(false);
      }
    } catch (error: any) {
      console.log(JSON.stringify(error));
      toast({
        title: 'Erro',
        description: `Erro ao cadastrar usuario, ${JSON.stringify(error, null, 2)}`,
        status: 'error',
        duration: 9000,
        isClosable: true
      })
      setBloq(false);
    }
  }

  return (
    <>
      {/* dados do vendedor */}
      <Flex w={'100%'} flexDir={'column'} justifyContent={'space-between'} p={5}>
        <Box w={'100%'}><Heading size={'md'} mb={3}>Vendedor</Heading></Box>
        <Flex gap={4} w={'100%'} px={3} flexWrap={'wrap'} >

          <Box w={'20%'}>
            <FormControl>
              <FormLabel fontSize={'xs'}>Nome do vendedor</FormLabel>
              <Input
                focusBorderColor="#ffff"
                bg='#ffffff12'
                shadow="sm"
                size="xs"
                w="full"
                fontSize="xs"
                rounded="md"
                value={Nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </FormControl>
          </Box>

          <Box w={'20%'}>
            <FormControl>
              <FormLabel fontSize={'xs'}>E-mail do vendedor</FormLabel>
              <Input
                focusBorderColor="#ffff"
                bg='#ffffff12'
                shadow="sm"
                size="xs"
                w="full"
                fontSize="xs"
                rounded="md"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </Box>

          <Box w={'20%'}>
            <FormControl>
              <FormLabel fontSize={'xs'}>Telefone do vendedor</FormLabel>
              <Input
                focusBorderColor="#ffff"
                bg='#ffffff12'
                shadow="sm"
                size="xs"
                w="full"
                fontSize="xs"
                rounded="md"
                value={Telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </FormControl>
          </Box>

          <Box w={'20%'}>
            <FormControl>
              <FormLabel fontSize={'xs'}>Recorde de venda</FormLabel>
              <Input
                focusBorderColor="#ffff"
                bg='#ffffff12'
                shadow="sm"
                size="xs"
                w="full"
                fontSize="xs"
                rounded="md"
                value={Recorde}
                onChange={(e) => setRecorde(e.target.value)}
              />
            </FormControl>
          </Box>

          <Box w={'20%'}>
            <FormControl>
              <FormLabel fontSize={'xs'}>Status</FormLabel>
              <Select
                focusBorderColor="#ffff"
                bg='#ffffff12'
                shadow="sm"
                size="xs"
                w="full"
                rounded="md"
                value={Status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option style={{ backgroundColor: "#1A202C" }}></option>
                <option style={{ backgroundColor: "#1A202C" }} value={"true"}>Ativo</option>
                <option style={{ backgroundColor: "#1A202C" }} value={"false"}>Inativo</option>
              </Select>
            </FormControl>
          </Box>

        </Flex>

        <Flex gap={4} justifyContent={'end'}>
          <Button colorScheme="green" isDisabled={Bloq} onClick={salvar}>Salvar</Button>
        </Flex>

      </Flex>
    </>
  )
}