'use client';
import FetchRequest from '@/function/fetch/request/route';
import { Box, Button, Flex, FormLabel, Select, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const SelectEmpresas = (props: {
  onValue: any; Usuario: any;
}) => {
  const [IdEmp, setIdEmp] = useState('');
  const [Data, setData] = useState<any>([]);
  const { data: session } = useSession();
  const toast = useToast()

  useEffect(() => {
    if (props.Usuario) {
      (async () => {
        try {
          const response = await FetchRequest.get(
            `/empresas?filters[user][username][$eq]=${props.Usuario}&filters[status][$eq]=true&sort[0]=nome%3Aasc&fields[0]=nome&fields[1]=CNPJ&fields[2]=valor_ultima_compra&fields[3]=ultima_compra&fields[4]=interacaos&populate[user][fields][0]=username&populate[businesses]=*`
          )
          setData(response.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [props.Usuario, session?.user.name]);

  const EspecifcFilter: any = [
    { id: 1, nome: 'EM ANDAMENTO' },
    { id: 2, nome: 'CONCLUÍDOS' },
    { id: 3, nome: 'TODOS OS NEGÓCIOS' },
    { id: 4, nome: 'PERDIDO' }
  ]

  const HandleValue = async () => {
    if (IdEmp === '0') {
      props.onValue(null);
      return;
    }
    const filter = EspecifcFilter.filter((f: any) => f.nome === IdEmp);
    try {
      const Filtro = IdEmp === 'EM ANDAMENTO'? 3: IdEmp === 'PERDIDO'? 1:5
      let resp;
      if(IdEmp === 'TODOS OS NEGÓCIOS') {
        resp = await FetchRequest.get(`/businesses?populate=*&filters[status][$eq]=true&filters[vendedor][username][$eq]=${props.Usuario}&sort[0]=id%3Adesc&pagination[limit]=8000`);
      } else if (filter.length > 0) {
        resp = await FetchRequest.get(`/businesses?populate=*&filters[status][$eq]=true&filters[andamento][$eq]=${Filtro}&filters[vendedor][username][$eq]=${props.Usuario}&sort[0]=id%3Adesc&pagination[limit]=8000`);
      } else {
        resp = await FetchRequest.get(`/businesses?populate=*&filters[status][$eq]=true&filters[empresa][id][$eq]=${IdEmp}&sort[0]=id%3Adesc&pagination[limit]=8000`);
      }
      props.onValue(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Flex flexDirection={'row'} gap={6} w={'100%'} alignItems={'self-end'}>
        <Box>
          <FormLabel
            htmlFor="cnpj"
            fontSize="xs"
            fontWeight="md"
            color="white"
          >
            Filtro
          </FormLabel>
          <Select
            w={'20rem'}
            onChange={(e) => setIdEmp(e.target.value)}
            value={IdEmp}
            color="white"
            bg='gray.800'
          >
            <option style={{ backgroundColor: "#1A202C" }} value={'0'}>selecione uma opção</option>
            {EspecifcFilter.map((f: any) => {
              return (
                <option style={{ backgroundColor: "#1A202C" }} key={f.id} value={f.nome}>{f.nome}</option>
              )
            })}
            {Data.map((i: any) => {
              return (
                <option style={{ backgroundColor: "#1A202C" }} key={i.id} value={i.id}>
                  {i.attributes.nome}
                </option>
              )
            })}
          </Select>
        </Box>
        <Button variant={'solid'} px={8} colorScheme='green' onClick={HandleValue}>Filtrar</Button>
      </Flex>
    </>
  );
};
