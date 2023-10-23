'use client';
import { LogEmpresa } from "@/function/LogEmpresa";
import FetchRequest from "@/function/fetch/request/route";
import { Box, Button, ButtonGroup, Flex, FormControl, FormLabel, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Select, useDisclosure, useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";


export const FormaPg = (props: { id: any; retorno: any; envio: any }) => {
  const [maxPg, setMaxpg] = useState("Antecipado");
  const [Titulo, setTitulo] = useState("");
  const [Valor, setValor] = useState("");
  const [Id, setId] = useState("");
  const [Data, setData] = useState<any>([]);
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [Block, setBlock] = useState(false)
  const firstFieldRef = useRef(null)
  const toast = useToast()
  const { data: session } = useSession()
  const Vendedor: any = session?.user.name

  useEffect(() => {
    if (props.retorno) {
      setMaxpg(props.retorno)
    }
    if (props.id) {
      (async () => {
        setId(props.id)
        try {
          const response = await FetchRequest.get(`/formapgs?filters[empresa][id][$eq]=${props.id}&populate=*`);
          const response2 = await FetchRequest.get(`/formapgs?filters[empresa][id][$null]=true`);
          const retorno1 = response.data
          const retorno2 = response2.data
          setData([...retorno1, ...retorno2])
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [props.id, props.retorno])

  const salvar = async () => {
    setBlock(true)
    const Dados = {
      data: {
        title: Titulo,
        value: Valor,
        empresas: Id
      }
    }

    try {
      const salve = await FetchRequest.post(`/formapgs`, Dados)
      toast({
        title: 'Salvo com sucesso',
        description: 'Configuração salva com sucesso: ' + JSON.stringify(salve.data, null, 2),
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      const response = await FetchRequest.get(`/formapgs?filters[empresa][id][$eq]=${props.id}&populate=*`);
      const response2 = await FetchRequest.get(`/formapgs?filters[empresa][id][$null]=true`);
      const retorno1 = response.data
      const retorno2 = response2.data
      setData([...retorno1, ...retorno2])
      await LogEmpresa(props.id, 'Empresa create', Vendedor)
      setValor('')
      setTitulo('')
      onClose()
      setBlock(false)
    } catch (error) {
      console.log(error)
      setBlock(false)
    }
  }


  return (
    <>
      <Flex gap={3} alignItems={'self-end'}>
        <Box>
          <FormLabel
            fontSize="xs"
            fontWeight="md"
          >
            Condição de pagamento
          </FormLabel>
          <Select
            focusBorderColor="#ffff"
            bg='#ffffff12'
            shadow="sm"
            size="xs"
            w="full"
            fontSize="xs"
            rounded="md"
            onChange={(e) => props.envio(e.target.value)}
            value={maxPg}
          >
            <option style={{ backgroundColor: "#1A202C" }}>
              Selecione uma condição de pagamento
            </option>
            {Data.map((i: any) => {

              return (
                <option style={{ backgroundColor: "#1A202C" }} key={i.id} value={i.attributes.value}>
                  {i.attributes.title}
                </option>
              )
            })}
          </Select>
        </Box>
        <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          placement='right'
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button colorScheme="whatsapp">Adicionar Pagamento</Button>
          </PopoverTrigger>
          <PopoverContent p={5}>
            <PopoverArrow />
            <PopoverCloseButton color={'black'} />
            <PopoverBody>

              <FormControl>
                <FormLabel
                  color={"black"}
                >
                  Condição
                </FormLabel>
                <Input
                  type="text"
                  color={"black"}
                  onChange={(e) => {
                    setTitulo(e.target.value)
                    setValor(e.target.value)
                  }}
                  value={Titulo}
                />
              </FormControl>

              <ButtonGroup display='flex' justifyContent='flex-end' mt={3}>
                <Button variant='outline' onClick={onClose}>
                  Cancel
                </Button>
                <Button isDisabled={Block} colorScheme='teal' onClick={salvar}>
                  Salvar
                </Button>
              </ButtonGroup>

            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>

    </>
  );
};
