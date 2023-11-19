'use client';
import { Box, Button, Flex, FormControl, FormLabel, GridItem, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Textarea, useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { capitalizeWords } from '@/function/mask/string';
import { PessoasData } from '../pessoas/page';
import FetchApi from '@/function/fetch/route';
// import { LogEmpresa } from '@/function/LogEmpresa';
import FetchRequest from '@/function/fetch/request/route';
import { LogEmpresa } from '@/app/api/lib/logEmpresa';

async function GetVendedores() {
  const request = await fetch('/api/user/get', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })
  const response = await request.json();
  return response;
}

export const CompPessoa = (props: { Resp: any; onAddResp: any; cnpj: any }) => {
  const [dados, setDados] = useState<any>([]);
  const [Vendedores, setVendedores] = useState<any>([]);
  const [VendedorId, setVendedorId] = useState<any>('');
  const [Nome, setNome] = useState('');
  const [Email, setEmail] = useState('');
  const [Telefone, setTelefone] = useState('');
  const [WhatApp, setWhatApp] = useState('');
  const [Departamento, setDepartamento] = useState('');
  const [Cargo, setCargo] = useState('');
  const [Obs, setObs] = useState('');
  const [Id, setId] = useState<number>();
  const [UPdate, setUPdate] = useState(false);
  const { data: session } = useSession();
  const [Bloq, setBloq] = useState(false);
  const toast = useToast()
  const Vendedor: any = session?.user.name;
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    (async () => {
      try {
        const dataVendedor = await GetVendedores()
        setVendedores(dataVendedor);
        GetRepresentante();
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    })()
  }, [GetRepresentante])


  const reset = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setWhatApp('');
    setDepartamento('');
    setCargo('');
    setObs('');

  }

  const SaveAdd = async () => {
    try {
      setBloq(true)
      const Data: any = {
        data: {
          nome: Nome,
          email: Email,
          telefone: Telefone,
          whatsapp: WhatApp,
          departamento: Departamento,
          cargo: Cargo,
          obs: Obs,
          user: VendedorId ? VendedorId : session?.user.id,
          permissao: VendedorId ? 'User' : 'Adm',
          empresa: props.Resp
        }
      }
      const PostSave = await fetch(`/api/representantes/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
      })
      const PostSaveResponse = await PostSave.json();
      if (!!PostSaveResponse) {
        toast({
          title: 'Representante adicionado com sucesso',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        GetRepresentante();
        onClose()
        setBloq(false)
      }
    } catch (error) {
      console.error(error)
      setBloq(false)
    }
  }


  async function Remover(idExcluir: any) {
    try {
      setBloq(true)
      const idPessoa = idExcluir;
      const excluir = await fetch(`/api/representantes/delete/${idPessoa}`,{ 
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { user: null } })
       });
       const excluirResponse = await excluir.json();
      if (!!excluirResponse) {
        await LogEmpresa(props.Resp, 'DELETE Representante', Vendedor)
        toast({
          title: 'Representante removido com sucesso',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        GetRepresentante();
        onClose()
        reset()
        setBloq(false)
      }
    } catch (error) {
      console.error(error)
      setBloq(false)
    }
  }

  function Atualizar(Respdata: any) {
    setVendedorId(Respdata.attributes.user?.data?.id)
    setId(Respdata.id)
    setNome(Respdata.attributes.nome);
    setEmail(Respdata.attributes.email);
    setTelefone(Respdata.attributes.telefone);
    setWhatApp(Respdata.attributes.whatsapp);
    setDepartamento(Respdata.attributes.departamento);
    setCargo(Respdata.attributes.Cargo);
    setObs(Respdata.attributes.obs);
    setUPdate(true);
    onOpen()
  }


  async function Update() {
    try {
      setBloq(true)
      const Data: any = {
        data: {
          nome: Nome,
          email: Email,
          telefone: Telefone,
          whatsapp: WhatApp,
          departamento: Departamento,
          cargo: Cargo,
          obs: Obs,
          user: VendedorId,
          permissao: VendedorId == session?.user.id ? 'User' : 'Adm',
        }
      }
      const PostSave = await fetch(`/api/representantes/put`,{ 
        method: 'post', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Data),
      })
      const PostSaveResponse = await PostSave.json();
      if (PostSaveResponse) {
        await LogEmpresa(props.Resp, 'Representante Update', Vendedor)
        toast({
          title: 'Representante editado com sucesso',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        GetRepresentante();
        onClose()
        setBloq(false)
      }
    } catch (error) {
      console.error(error)
      setBloq(false)
    }

  }

  async function handlereload() {
    GetRepresentante();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function GetRepresentante() {
    (async () => {
      try {
        if (session?.user.pemission === 'Adm') {
          const request = await FetchRequest.get(
            `/representantes?filters[status][$eq]=true&populate[user][fields][0]=username&filters[empresa][id][$eq]=${props.Resp}`
            );
          const dados = request.data;
  
          setDados(dados)
          return dados
        } else {
          const request1 = await FetchRequest.get(
            `/representantes?filters[status][$eq]=true&filters[user][username][$eq]=${session?.user.name}&filters[empresa][id][$eq]=${props.Resp}&populate[user][fields][0]=username`
            );
          const dados1 = request1.data;
          const request2 = await FetchRequest.get(
            `/representantes?filters[status][$eq]=true&filters[permissao][$eq]=Adm&filters[empresa][id][$eq]=${props.Resp}&populate[user][fields][0]=username`
            );
          const dados2 = request2.data;
  
          setDados([...dados1, ...dados2])
          return dados2
        }
  
      } catch (error) {
        console.log(error);
        toast({
          title: 'Erro ao buscar dados, error: ' + JSON.stringify(error, null, 2),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
        return error
      }
    })()
  }

  return (
    <Box>
      <Flex gap={5} flexDir={'row'} alignItems={'self-end'}>
        <Button
          h={8}
          px={5}
          colorScheme="teal"
          onClick={onOpen}
        >
          + Nova Pessoa
        </Button>

        {dados.map((i: any) => <PessoasData key={i.id} empresaId={props.Resp} data={i} respData={Remover} respAtualizar={Atualizar} reload={handlereload} />)}

      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={'gray.700'} color={'white'}>
          <ModalHeader>Add Pessoal</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <SimpleGrid
              w={'100%'}
              columns={1}
              spacing={6}
            >

              <SimpleGrid columns={12} spacing={3}>
                <FormControl as={GridItem} colSpan={[12]}>
                  <FormLabel fontSize="xs" fontWeight="md">
                    Nome
                  </FormLabel>
                  <Input
                    type="text"
                    focusBorderColor="#ffff"
                    bg='#ffffff12'
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e) => setNome(capitalizeWords(e.target.value))}
                    value={Nome}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={6}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="md"
                  >
                    E-mail
                  </FormLabel>
                  <Input
                    type="text"
                    focusBorderColor="white"
                    bg={'#ffffff12'}
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e: any) => setEmail(e.target.value)}
                    value={Email}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={6}>
                  <FormLabel
                    htmlFor="cep"
                    fontSize="xs"
                    fontWeight="md"
                  >
                    Telefone
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="(00) 0000-0000"
                    focusBorderColor="white"
                    bg={'#ffffff12'}
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e) => setTelefone(e.target.value)}
                    value={Telefone}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={6}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="md"
                  >
                    Whatsapp
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="(00) 0 0000-0000"
                    focusBorderColor="white"
                    bg={'#ffffff12'}
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e) => setWhatApp(e.target.value)}
                    value={WhatApp}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={6}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="md"
                  >
                    Departamento
                  </FormLabel>
                  <Input
                    type="text"
                    focusBorderColor="white"
                    bg={'#ffffff12'}
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e) => setDepartamento(capitalizeWords(e.target.value))}
                    value={Departamento}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={9}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="md"
                  >
                    Cargo
                  </FormLabel>
                  <Input
                    type="text"
                    focusBorderColor="white"
                    bg={'#ffffff12'}
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e) => setCargo(capitalizeWords(e.target.value))}
                    value={Cargo}
                  />
                </FormControl>
                {session?.user.pemission === 'Adm' && <FormControl as={GridItem} colSpan={9}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="md"
                  >
                    Vendedor
                  </FormLabel>
                  <Select
                    focusBorderColor="white"
                    bg={'#ffffff12'}
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e) => setVendedorId(e.target.value)}
                    value={VendedorId}

                  >
                    <option
                      style={{ backgroundColor: '#515151', color: 'white' }}
                      value=''
                    ></option>
                    {!!Vendedores && Vendedores.map((i: any) => {
                      return (
                        <option
                          key={i.id}
                          // bg={'gray.600'}
                          style={{ backgroundColor: '#515151', color: 'white' }}
                          value={i.id}
                        >
                          {i.username}
                        </option>
                      );
                    })}

                  </Select>

                </FormControl>
                }

              </SimpleGrid>

              <SimpleGrid columns={12} spacing={3}>

                <Heading as={GridItem} colSpan={12} size="sd">
                  Observações
                </Heading>
                <Box as={GridItem} colSpan={12} >
                  <Textarea
                    borderColor="white"
                    bg={'#ffffff12'}
                    placeholder="Especifique aqui, todos os detalhes do cliente"
                    size="sm"
                    resize={"none"}
                    onChange={(e: any) => setObs(capitalizeWords(e.target.value))}
                    value={Obs}
                  />
                </Box>
              </SimpleGrid>

            </SimpleGrid>

          </ModalBody>
          <ModalFooter>
            {!UPdate && <Button colorScheme='blue' mr={3} isDisabled={Bloq} onClick={SaveAdd}>Adicionar</Button>}
            {!!UPdate && <Button colorScheme='blue' mr={3} isDisabled={Bloq} onClick={Update}>Atualizar</Button>}

          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};
