import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { Box, Checkbox, Flex, Heading, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, list } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";


async function RequestCard() {
  const session = await getServerSession(nextAuthOptions);
  // const idTrello = session?.user?.trello_id;
  const idTrello = "62a736038685171186013ba4";

  try {
    const token: any = process.env.TRELLO_TOKEN;
    const KEY: any = process.env.TRELLO_KEY;
    const BaseUrl: any = process.env.TRELLO_BASEURL;
    const idBoard: any = process.env.TRELLO_BOARDID;
    const response = await fetch(`${BaseUrl}/members/${idTrello}/cards?key=${KEY}&token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    if (response.ok) {
      const data = await response.json();
      const CardsFilter = data.filter((card: any) => card.idBoard === idBoard);
      const CardsFilterDueNotNul = CardsFilter.filter((card: any) => card.due !== null);

      const Retorno: any = CardsFilterDueNotNul.map((card: any) => {
        return {
          id: card.id,
          name: card.name,
          due: card.due,
          dueComplete: card.dueComplete,
          closed: card.closed,
          idList: card.idList,
          idBoard: card.idBoard,
          idLabels: card.idLabels,
          labels: card.labels,
          dateLastActivity: card.dateLastActivity,
          desc: card.desc,
          shortUrl: card.shortUrl,
          url: card.url,
          idMembers: card.idMembers
        }
      })
      Retorno.sort((a: any, b: any) => new Date(b.due).getTime() - new Date(a.due).getTime())
      return Retorno;
    }
  } catch (error: any) {
    console.log(error)
  }
}

async function RequestList() {
  try {
    const token: any = process.env.TRELLO_TOKEN;
    const KEY: any = process.env.TRELLO_KEY;
    const BaseUrl: any = process.env.TRELLO_BASEURL;
    const idBoard: any = process.env.TRELLO_BOARDID;
    const response = await fetch(`${BaseUrl}/boards/${idBoard}/lists?key=${KEY}&token=${token}&fields=name`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error: any) {
    console.log(error)
  }
}

async function Producao() {

  const Trello = await RequestCard();
  const TrelloList = await RequestList();

  const CardSeparado = Trello.map((card: any) => {
    const matchingList = TrelloList.find((list: any) => list.id === card.idList);

    if (matchingList) {
      return {
        ...card,
        listName: matchingList.name
      };
    }

    return card; // Retornar o card original caso não haja correspondência na lista
  });

  const CardlIst = CardSeparado.filter((card: any) => {
    const dueDate = new Date(card.due);
    const date = new Date();
    const currentDate = new Date(date.getFullYear(), date.getMonth() -1, 1);
    const dueDateIsAfterCurrentDate = dueDate > currentDate;
    return dueDateIsAfterCurrentDate;
  });

  return (
    <>
      <Box w={'100%'} minH={'100vh'} bg="gray.800" p={4} overflow={'auto'} color={'white'}>
        <Box mb={10}><Heading>Fila de Produção</Heading></Box>
        <Box p={5} maxW={'100%'} borderWidth={1} borderRadius={8} boxShadow={'lg'} bg={'gray.700'}>
          <TableContainer>
            <Table size={'sm'}>
              <TableCaption color={'whatsapp.200'}>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                  <Th color={'whatsapp.500'}>Cliente</Th>
                  <Th color={'whatsapp.500'}>Qtd</Th>
                  <Th color={'whatsapp.500'}>Nome do produto</Th>
                  <Th color={'whatsapp.500'}>Data de Entrega</Th>
                  <Th color={'whatsapp.500'}>status</Th>
                  <Th color={'whatsapp.500'}>Trello</Th>
                  <Th color={'whatsapp.500'}>Concluido</Th>
                </Tr>
              </Thead>
              <Tbody>
                {!!CardlIst && CardlIst.map((card: any) => {
                  const Nome = card.name.split("-");
                  return (
                    <Tr key={card.id}>
                      <Td>{Nome[0]}</Td>
                      <Td>{Nome[1]}</Td>
                      <Td>{Nome[2]}</Td>
                      <Td>{new Date(card.due).toLocaleDateString()}</Td>
                      <Td>{card.listName}</Td>
                      <Td textAlign={'center'}><Link href={card.url}  target="_blank" rel="noopener noreferrer"><Flex>Link <BiLinkExternal /></Flex></Link></Td>
                      <Td textAlign={'center'}><Checkbox isChecked={card.dueComplete} /></Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  )
}

export default Producao