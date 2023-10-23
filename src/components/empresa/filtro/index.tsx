'use client';
import { Button, Flex, FormLabel, Input } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { useState } from "react"

export const FiltroEmpresa = () => {
  const [SearchEmpr, setSearchEmpr] = useState<string>('')
  const {push} = useRouter()

  const Pesqisa = () =>{
    if(SearchEmpr){
      push(`/empresas/search?titulo=${SearchEmpr}`)
    } else {
      push(`/empresas`)
    }
  }

  return (
    <>
      <FormLabel
        fontSize="xs"
        fontWeight="md"
      >
        Empresa
      </FormLabel>
      <Flex gap={5}>
        <Input
          type="text"
          size={'sm'}
          borderColor="white"
          focusBorderColor="white"
          rounded="md"
          onChange={(e) => setSearchEmpr(e.target.value)}
          value={SearchEmpr}
          onBlur={(e) => {
            const value = e.target.value
            if(value.length == 0){
              setSearchEmpr('')
              Pesqisa()
            }
          }}
        />
        <Button px={8} size={'sm'} onClick={Pesqisa} colorScheme="green">Filtro</Button>
      </Flex>
    </>
  )
}
