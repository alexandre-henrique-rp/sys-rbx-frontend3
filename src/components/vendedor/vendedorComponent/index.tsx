"use client"

import FetchRequest from "@/function/fetch/request/route";
import { BaseURL } from "@/function/request";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Heading, IconButton, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";

interface VendedorComponentProps {
  props: { data: any };
}

export const VendedorComponent = ({ props }: VendedorComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [Nome, setNome] = useState('');
  const [Email, setEmail] = useState('');
  const [Tel, setTel] = useState('');
  const [Record, setRecord] = useState('');
  const [PassWord, setPassWord] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Data, setData] = useState<any | null>([]);
  const [Bloq, setBloq] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (props.data) {
      setData(props.data);
    }
  }, [props.data]);


  const Salvar = async () => {
    try {
      setBloq(true);
  
      const userData = {
        username: Nome,
        nome: Nome,
        email: Email,
        setor: "Vendas",
        pemission: "User",
        password: PassWord,
        tel: Tel,
        record: Record,
        role: 1,
        confirmed: true
      };
  
      const saveResponse = await FetchRequest.post(`/users`, userData);
      if(saveResponse.data) {
        const listaResponse = await FetchRequest.get(`/users`);
    
        setData(listaResponse.data);
        setBloq(false);
        onClose();
    
        toast({
          title: 'Sucesso',
          description: 'Usuário cadastrado com sucesso',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.log(error);
      onClose();
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar usuário, '+ JSON.stringify(error.response.data.error.message),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      setBloq(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Flex w={'100%'} h={'100%'} overflowY={'auto'} justifyContent={'center'} alignItems={'center'} p={4} color={'white'} bg={'gray.800'}>
        <Box w={'100%'} h={'auto'} bg={'gray.700'} p={10} rounded={10}>
          <Flex justifyContent={'space-between'}>
            <Heading size={'lg'}>Vendedor</Heading>
            <IconButton
              isRound={true}
              variant='solid'
              colorScheme='whatsapp'
              aria-label='Adicionar vendedor'
              fontSize='30px'
              p={1.5}
              onClick={onOpen}
              icon={<MdOutlineAddCircleOutline color="#ffff" />}
            />
          </Flex>
          <Box w={'100%'} maxH={'30rem'} overflowY={'auto'} px={10} my={5}>
            <TableContainer>
              <Table size='sm'>
                <Thead bg='#ffffff12' h={5}>
                  <Tr>
                    <Th color={'white'}>Vendedor</Th>
                    <Th color={'white'}>status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item: any, x: number) => {
                    const confirmed = item.confirmed ? 'ATIVO' : 'INATIVO';
                    return (
                      <Tr key={item.id} cursor={'pointer'} onClick={() => router.push(`/vendedor/${item.id}`)}>
                        <Td>{item.username}</Td>
                        <Td>{confirmed}</Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Flex>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
        size={'lg'}
      >
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropInvert='40%'
          backdropBlur='2px'
        />
        <ModalContent bg={'gray.800'} color={'white'}>
          <ModalHeader p={8}>Modal Title</ModalHeader>
          <ModalBody bg={'gray.800'}>
            <Flex w={'100%'} gap={5} flexWrap={'wrap'} px={8}>

              <Box w={'100%'}>
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input w={'100%'} onChange={(e) => setNome(e.target.value)} />
                  <FormHelperText>Nome do Vendedor é obrigatório</FormHelperText>
                </FormControl>
              </Box>
              <Box w={'100%'}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input type={'email'} w={'100%'} onChange={(e) => setEmail(e.target.value)} />
                  <FormHelperText>O email é obrigatório</FormHelperText>
                </FormControl>
              </Box>
              <Box w={'100%'}>
                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input w={'100%'} onChange={(e) => setTel(e.target.value)} />
                </FormControl>
              </Box>
              <Box w={'100%'}>
                <FormControl>
                  <FormLabel>
                    Recorde de venda
                  </FormLabel>
                  <Input w={'100%'} onChange={(e) => {
                    const valor = e.target.value;
                    const ValorLimpo = valor.replace(/[^0-9]/g, '');
                    setRecord(ValorLimpo);
                  }}
                    value={Record}
                  />
                </FormControl>
              </Box>
              <Box w={'100%'}>
                <FormControl>
                  <FormLabel>Senha</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Senha"
                      w={'100%'}
                      value={PassWord}
                      onChange={(e) => setPassWord(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={togglePasswordVisibility}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter bg={'gray.800'} py={5}>
            <Button colorScheme='blue' mr={3} onClick={Salvar} isDisabled={Bloq}>
              Salvar
            </Button>
            <Button variant='solid' colorScheme='red'>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}