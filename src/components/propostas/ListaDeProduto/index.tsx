'use client';
import {
  Box,
  FormLabel,
  IconButton,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";

export const ProdutiList = (props: {
  Lista?: any;
  Retorno?: any
}) => {
  const [Load, setLoad] = useState<boolean>(false);
  const [Produtos, setProdutos] = useState<any | null>(null);
  const [itenId, setItenId] = useState("");
  const toast = useToast()


  useEffect(() => {
    setProdutos(props.Lista);
  }, [props.Lista]);

  const addItens = async () => {
    setLoad(true);
    if(itenId){
      try {
        const url = `/api/produto/${itenId}`;
        const request = await fetch(url)
        if (request.ok) {
          const response = await request.json()
          console.log("🚀 ~ file: index.tsx:33 ~ addItens ~ response:", response)
          props.Retorno(response);
          setLoad(false);
        }
      } catch (error: any) {
        console.log(error)
        toast({
          title: 'Ocorreu um erro',
          description: `${JSON.stringify(error, null, 2)}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setLoad(false);
      }
    } else {
      toast({
        title: 'Ocorreu um erro',
        description: `Selecione um Produto`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setLoad(false);
    }
  };

  return (
    <>
      <Box>
        <Box
          display="flex"
          gap={5}
          w={"320px"}
          alignItems="center"
        >
          <Box>
            <FormLabel
              fontSize="xs"
              fontWeight="md"
            >
              Produtos
            </FormLabel>
            <Select
              shadow="sm"
              size="xs"
              w="14rem"
              fontSize="xs"
              rounded="md"
              onChange={(e) => setItenId(e.target.value)}
              value={itenId}
            >
              <option style={{ backgroundColor: "#1A202C" }}>Selecione um Produto</option>
              {!Produtos ? null : Produtos.map((item: any) => {
                return (
                  <>
                    <option style={{ backgroundColor: "#1A202C" }} key={item.prodId} value={item.prodId}>{item.nomeProd}</option>
                  </>
                );
              })}
            </Select>
          </Box>
          <Box>
            <IconButton
              aria-label="Add Negocio"
              rounded={'3xl'}
              mt={6}
              colorScheme="transparent"
              onClick={addItens}
              isDisabled={Load}
            >
              <MdOutlineAddCircleOutline color="#179848" size={'2rem'} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};
