'use client';

import { Box, Flex, FormLabel, Heading, Text } from '@chakra-ui/react';
import { SelectUser } from '@/components/painel/selectUser';
import { SelectMonth } from '@/components/painel/selecMont';
import { RenderCalendar } from '@/components/painel/calendar';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

async function GetRequest(inicio: string, fim: string , vendedor: string) {
  const request = await fetch(`/api/painel?DataIncicio=${inicio}&DataFim=${fim}&Vendedor=${vendedor}`);
  const response = await request.json();
  return response;
}


export default function Painel() {

  const {data: session} = useSession();
  const [calendarData, setcalendarData] = useState<any>();
  const [Concluido, setConcluido] = useState<string>('');
  const [Andamento, setAndamento] = useState<string>('');
  const [Perdido, setPerdido] = useState<string>('');
  const [User, setUser] = useState<string>('');
  const [DateStart, setDateStart] = useState<any>();
  const [DateEnd, setDateEnd] = useState<any>();
  const dataAtual = new Date();
  const primeiroDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1).toISOString();
  const ultimoDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0).toISOString();
  
  if(session && !User) {
    setUser(session?.user.name);
  }

  useEffect(() => {
    const vendedorInicio: any = session?.user.name;
    (async () => {
      const response = await GetRequest(primeiroDiaDoMes, ultimoDiaDoMes, vendedorInicio);
      setcalendarData(response.DataSeparada);
      setConcluido(response.conclusao);
      setAndamento(response.em_aberto);
      setPerdido(response.perdido);
    })();
  }, [User, primeiroDiaDoMes, session?.user.name, ultimoDiaDoMes])

  function handleDateChange(month: any) {
    const { start, end } = month;
    setDateEnd(end);
    setDateStart(start);
    (async () => {
      const response = await GetRequest(start, end, User);
      setcalendarData(response.DataSeparada);
      setConcluido(response.conclusao);
      setAndamento(response.em_aberto);
      setPerdido(response.perdido);
    })()
  }

  function handleUserChange(user: string) {
    const Vendedor: any = user;
    setUser(Vendedor);
    (async () => {
      const response = await GetRequest(DateStart ,DateEnd, Vendedor);
      setcalendarData(response.DataSeparada);
      setConcluido(response.conclusao);
      setAndamento(response.em_aberto);
      setPerdido(response.perdido);
    })()
  }

  return (
    <>
      <Box h={'100%'} bg={'gray.800'} color={'white'}>
        <Flex px={5} pt={2} justifyContent={'space-between'} w={'100%'}>
          <Flex gap={16}>
            {session?.user.pemission === 'Adm' && (
              <>
                <SelectUser onValue={handleUserChange} user={User} />
                <Box>
                </Box>
              </>
            )}
            {session?.user.pemission !== 'Adm' && (
              <>
                <Box>
                  <Heading pt={5} size={'lg'}>{session?.user.name}</Heading>
                </Box>
              </>
            )}
            <Box>
              <SelectMonth onValue={handleDateChange} />
            </Box>
          </Flex>
          <Flex alignItems={'center'} gap={5}>
            <Flex flexDirection={'column'} justifyContent={'center'}>
              <FormLabel textAlign={'center'} color={'white'}>Em Andamento</FormLabel>
              <Flex w={'8rem'} h={'2rem'} py={1} bg={'orange.400'} color={'white'} justifyContent={'center'} alignItems={'center'} rounded={'1rem'}>
                <Text>{Andamento}</Text>
              </Flex>
            </Flex>
            <Flex flexDirection={'column'} justifyContent={'center'}>
              <FormLabel textAlign={'center'} color={'white'}>Ganhos</FormLabel>
              <Flex w={'8rem'} h={'2rem'} py={1} bg={'green.500'} color={'white'} justifyContent={'center'} alignItems={'center'} rounded={'1rem'}>
                <Text>{Concluido}</Text>
              </Flex>
            </Flex>
            <Flex flexDirection={'column'} justifyContent={'center'}>
              <FormLabel textAlign={'center'} color={'white'}>Perdidos</FormLabel>
              <Flex w={'8rem'} h={'2rem'} py={1} bg={'red'} color={'white'} justifyContent={'center'} alignItems={'center'} rounded={'1rem'}>
                <Text>{Perdido}</Text>
              </Flex>
            </Flex>
          </Flex>

        </Flex>
        <Box w='100%' bg="gray.800" color={'gray.800'}>
          <Flex direction="column" gap={5} p={5}>
            <RenderCalendar data={calendarData} />
          </Flex>
        </Box>
      </Box>

    </>
  );
};



