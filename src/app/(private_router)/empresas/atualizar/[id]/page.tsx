'use client';
import { FormEmpresa } from '@/components/empresa/form/page';
import FetchApi from '@/function/fetch/route';
import { Box, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface EmpresaIdProps {
  params: {
    id: string;
  }
}


export default function EmpresaId({ params }: EmpresaIdProps) {
  const { data: session } = useSession();
  const ID = params.id
  const [DataEmp, setDataEmp] = useState<any | null>(null);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/empresa/atualizar/get?id=${ID}`);
      const empresa = await response.json();
      setDataEmp(empresa)
      if (empresa.attributes.user.data?.attributes.username !== session?.user.name && session?.user.pemission !== 'Adm') {
        toast({
          title: `O cliente ${empresa.attributes.nome}`,
          description: `pertence ao vendedor(a) ${empresa.attributes.user.data?.attributes.username}`,
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        })
      }
    })()
  }, [ID, session?.user.name, session?.user.pemission, toast]);


  return (
    <>
      <Box w={'100%'} h={'100vh'} bg="gray.800">
        <FormEmpresa envio='UPDATE' data={DataEmp} id={ID} />
      </Box>
    </>
  );
}
