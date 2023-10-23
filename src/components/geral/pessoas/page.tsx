'use client'

import { LogEmpresa } from "@/function/LogEmpresa";
import FetchApi from "@/function/fetch/route";
import { primeiroNome } from "@/function/mask/primeiroNome";
import { Box, Button, Flex, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Text, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";



export const PessoasData = (props: { data: any; respData: any; respAtualizar: any, reload: any, empresaId: any }) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [dados, setDados] = useState<any>([]);
  const [ID, setID] = useState('');
  const { data: session } = useSession();
  const toast = useToast();
  const Vendedor: any = session?.user.name;

  useEffect(() => {
    if (props.data) {
      setDados(props.data.attributes)
      setID(props.data.id)
    }
  }, [dados.length, props.data])


  const color = !dados.user?.data ? 'red.500' : 'messenger.500'
  const colorButton = !dados.user?.data ? 'red' : 'messenger'
  const disable = !dados.user?.data

  const remove = async () => {
    try {
      console.log(ID)
      const update = {
        data: {
          status: false,
        },
      };
      const response = await FetchApi({ url: `/representantes/${ID}`, method: 'PUT', data: update });
      const resposta = response.data;
      toast({
        title: 'Representante removido permanente com sucesso',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      })
      await LogEmpresa(props.empresaId, 'representante Remove', Vendedor)
      console.log(resposta)
      props.reload()
      onClose()
    } catch (error) {
      console.error("Erro ao remover:", error);
      toast({
        title: 'Erro ao remover, error: ' + JSON.stringify(error, null, 2),
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      })
    }
  }


  return (
    <>

      <Box>
        <Flex flexDir={'row'} gap={4} w={'auto'} p={1} px={2} bg={color} h={8} alignItems={'center'} rounded={5}>
          {primeiroNome(dados.nome)}
          <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            closeOnBlur={false}
            key={dados.id}
          >
            <PopoverTrigger>
              <IconButton
                p={0}
                colorScheme={colorButton}
                aria-label='Call Sage'
                fontSize='25px'
                size={'xs'}
                icon={<IoMdClose />}

              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent bg={'gray.700'} color="white">
                <PopoverArrow bg={'gray.700'} />
                <PopoverHeader>{dados.nome}</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <Box>
                    {!!dados.email && <Text>Email: {dados.email},</Text>}
                    {!!dados.telefone && <Text>Telefone: {dados.telefone},</Text>}
                    {!!dados.whatsapp && <Text>Whatsapp: {dados.whatsapp},</Text>}
                    {!!dados.departamento && <Text>Departamento: {dados.departamento},</Text>}
                    {!!dados.cargo && <Text>cargo: {dados.cargo},</Text>}
                    {!!dados.obs && <Text mt={1}>Obs: {dados.obs},</Text>}
                    {!!dados.user?.data?.attributes.username && session?.user.pemission === 'Adm' ? <Text mt={1}>Vendedor: {dados.user?.data?.attributes.username},</Text> : <></>}
                  </Box>
                </PopoverBody>
                <PopoverFooter>
                  <Flex w={'full'} justifyContent={'end'} gap={5}>
                    {!!dados.user?.data?.attributes.username && (
                      <Button colorScheme='red' isDisabled={disable} onClick={() => {
                        props.respData(ID)
                        onClose()
                      }}
                      >
                        Remover
                      </Button>
                    )}
                    {!dados.user?.data && (
                      <Button colorScheme='red' isDisabled={session?.user.pemission === 'Adm' ? false : true} onClick={() => {
                        remove()
                      }}
                      >
                        Remover
                      </Button>
                    )}
                    <Button colorScheme='green' onClick={() => {
                      props.respAtualizar(props.data)
                      onClose()
                    }}
                    >
                      Atualizar
                    </Button>
                  </Flex>
                </PopoverFooter>
              </PopoverContent>
            </Portal>
          </Popover>
        </Flex>
      </Box>
    </>
  )
}
