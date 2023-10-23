import { Box } from "@chakra-ui/react";
import React from "react";
import { FormEmpresa } from "@/components/empresa/component/form";

export default function Cadastro() {


  return (
    <>
    <Box w={'100%'} h={'100vh'} bg="gray.800">
      <FormEmpresa envio="POST" />
    </Box>
    </>
  );
}
