import { Box, Heading, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { MdArrowCircleRight } from "react-icons/md";

interface TabelaUserProps {
  data: any
}

export const TabelaUser = ({ data }: TabelaUserProps) => {
  console.log("🚀 ~ file: index.tsx:11 ~ TabelaUser ~ data:", data)
  return (
    <>
      <Box w={'100%'}>
        {!data && (<></>)}
        {!!data && (
          <>
            <Box>
              <Heading size='md'>Informações Adicionais</Heading>
            </Box>
            <List spacing={3} pt={5}>
              <ListItem display={'flex'} gap={2} hidden={!data.salario_fixo}>
                <ListIcon as={MdArrowCircleRight} color='lime' fontSize={'2xl'} />
                <Text fontWeight={'bold'}>Salário Fixo:</Text>
                <Text>{!!data && Number(data.salario_fixo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
              </ListItem>
              <ListItem display={'flex'} gap={2} hidden={!data.ajuda_de_custo}>
                <ListIcon as={MdArrowCircleRight} color='lime' fontSize={'2xl'} />
                <Text fontWeight={'bold'}>Ajuda de custo:</Text>
                <Text>{!!data && Number(data.ajuda_de_custo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
              </ListItem>
              <ListItem display={'flex'} gap={2}>
                <ListIcon as={MdArrowCircleRight} color='lime' fontSize={'2xl'} />
                <Text fontWeight={'bold'}>Prêmio por decêndios batidos:</Text>
                <Text>{!!data && Number(data.meta_decendio).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
              </ListItem>
              <ListItem display={'flex'} gap={2}>
                <ListIcon as={MdArrowCircleRight} color='lime' fontSize={'2xl'} />
                <Text fontWeight={'bold'}>Prêmio por meta mensal batida:</Text>
                <Text>{!!data && Number(data.premio_meta_do_mes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
              </ListItem>
              <ListItem display={'flex'} gap={2}>
                <ListIcon as={MdArrowCircleRight} color='lime' fontSize={'2xl'} />
                <Text fontWeight={'bold'}>Prêmio por recorde batido:</Text>
                <Text>{!!data && Number(data.premio_recorde_de_vendas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
              </ListItem>
              <ListItem display={'flex'} gap={2}>
                <ListIcon as={MdArrowCircleRight} color='lime' fontSize={'2xl'} />
                <Text fontWeight={'bold'}>Comissão clientes Ribermax:</Text>
                {/* <Text>{!!data && Number(data.ajuda_de_custo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> */}
              </ListItem>
              <ListItem display={'flex'} gap={2}>
                <ListIcon as={MdArrowCircleRight} color='lime' fontSize={'2xl'} />
                <Text fontWeight={'bold'}>Comissão clientes próprios:</Text>
                {/* <Text>{!!data && Number(data.ajuda_de_custo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text> */}
              </ListItem>
              <ListItem display={'flex'} gap={2} hidden={!data.entradas_especial}>
                <ListIcon as={MdArrowCircleRight} color='lime' fontSize={'2xl'} />
                <Text fontWeight={'bold'}>Comissão cliente especiais:</Text>
                <Text>{!!data && Number(data.ajuda_de_custo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
              </ListItem>

            </List>
          </>
        )}
      </Box>
    </>
  )
}