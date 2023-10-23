'use client';
import FetchApi from "@/function/fetch/route";
import { Box, Button, ButtonGroup, Flex, FormControl, FormLabel, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Select, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";


export const PrazoPg = (props: { id: any; retorno: any; envio: any }) => {
  const [maxPg, setMaxpg] = useState("0");
  const [Titulo, setTitulo] = useState("");
  const [Valor, setValor] = useState("");
  const [Id, setId] = useState("");
  const [Data, setData] = useState<any>([]);
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [Block, setBlock] = useState(false)
  const firstFieldRef = useRef(null)

  useEffect(() => {
    if (props.retorno) {
      setMaxpg(props.retorno)
    }
    if (props.id) {
      setId(props.id);
      (async () => {
        try {
          const request = await FetchApi({ url: `/prazo-pgs?filters[empresa][id][$eq]=${props.id}`, method: 'GET', isCache: 'no-store' });
          const request2 = await FetchApi({ url: `/prazo-pgs?filters[empresa][id][$null]=true`, method: 'GET', isCache: 'no-store' });
          const retorno1 = request.data
          const retorno2 = request2.data
          setData([...retorno1, ...retorno2])
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      })()
    }
  }, [props.id, props.retorno])

  const salvar = async () => {
    try {
      setBlock(true)
      const Dados = {
        data: {
          title: Titulo,
          value: Valor,
          empresa: Id
        }
      }
      const respostaPost = await FetchApi({ url: `/prazo-pgs`, method: 'POST', data: Dados })
      if (respostaPost) {
        const request = await FetchApi({ url: `/prazo-pgs?filters[empresa][id][$eq]=${Id}`, method: 'GET', isCache: 'no-store' });
        const request2 = await FetchApi({ url: `/prazo-pgs?filters[empresa][id][$null]=true`, method: 'GET', isCache: 'no-store' });
        const retorno1 = request.data
        const retorno2 = request2.data
        setData([...retorno1, ...retorno2])
        setValor('')
        setTitulo('')
        onClose()
        setBlock(false)
      }
    } catch (error) {
      console.error(error)
      setBlock(false)
    }
  }


  return (
    <>
      <Flex gap={3} alignItems={'self-end'}>
        <Box>
          {/* Label for the maximum payment deadline selection */}
          <FormLabel
            htmlFor="prazo pagamento"
            fontSize="xs"
            fontWeight="md"
          >
            Máximo prazo p/ pagamento:
          </FormLabel>
          {/* Select element for choosing the maximum payment deadline */}
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
            {/* Default option */}
            <option style={{ backgroundColor: "#1A202C" }}>
              Selecione uma tabela
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
            <Button colorScheme="whatsapp">Adicionar prazo</Button>
          </PopoverTrigger>
          <PopoverContent p={5} bg='gray.800'>
            <PopoverArrow bg='gray.800'/>
            <PopoverCloseButton color={'white'} />
            <PopoverBody>

              <FormControl>
                <FormLabel
                  color={"white"}
                >
                  Titulo
                </FormLabel>
                <Input
                  type="text"
                  color={"white"}
                  onChange={(e) => setTitulo(e.target.value)}
                  value={Titulo}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  color={"white"}
                >
                  Valor
                </FormLabel>
                <Input
                  type="text"
                  color={"white"}
                  onChange={(e) => {
                    const valor = e.target.value;
                    const numeros: any = valor.replace(/\D/g, '');
                    setValor(numeros)
                  }}
                  value={Valor}
                />
              </FormControl>

              <ButtonGroup display='flex' justifyContent='flex-end' mt={3}>
                <Button colorScheme="whatsapp" color={'white'} _hover={{ color: 'black', bg: 'white' }} onClick={onClose}>
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
