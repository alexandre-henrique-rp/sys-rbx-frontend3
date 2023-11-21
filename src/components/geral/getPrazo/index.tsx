'use client';
import { Box, Flex, FormLabel, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";


export const GetPrazoPg = (props: { id: any; retorno: any; envio: any }) => {
  const [maxPg, setMaxpg] = useState("0");
  const [Data, setData] = useState<any>([]);

  useEffect(() => {
    if (props.retorno) {
      setMaxpg(props.retorno)

    }
    if (props.id) {
      (async () => {
        try {
          const request = await fetch(`/api/db/empresas/getMaxPrazoPg?EmpresaId=${props.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          })
          const response = await request.json();
          setData(response)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [props.id, props.retorno])



  return (
    <>
      <Flex gap={3} alignItems={'self-end'}>
        <Box>
         
          <FormLabel
            htmlFor="prazo pagamento"
            fontSize="xs"
            fontWeight="md"
          >
            Máximo prazo p/ pagamento:
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
            {/* Default option */}
            <option style={{ backgroundColor: "#1A202C" }}>
              Selecione uma tabela
            </option>
            {Data.map((i: any) => {
              console.log(i)
              return (
                <option style={{ backgroundColor: "#1A202C" }} key={i.id} value={i.attributes.value}>
                  {i.attributes.title}
                </option>
              )
            })}
          </Select>
        </Box>
      </Flex>
    </>
  );
};
