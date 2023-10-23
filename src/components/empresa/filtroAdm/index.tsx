'use client';
import { Button, Flex, FormLabel, Input } from "@chakra-ui/react"
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react"

interface FiltroProps {
  User: any
}

export const FiltroEmpresaAdm = ({ User }: FiltroProps) => {
  const [SearchEmpr, setSearchEmpr] = useState<string>('')
  const {push} = useRouter()

  const Pesqisa = () =>{
    if(SearchEmpr){
      push(`/empresas/adm/search?titulo=${SearchEmpr}&user=${User}`)
    } else {
      push(`/empresas/adm`)
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
