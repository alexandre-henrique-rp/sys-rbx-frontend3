import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { Box } from "@chakra-ui/react";
import { getServerSession } from "next-auth";

async function Request() {
  const session = await getServerSession(nextAuthOptions);
  const idTrello = session?.user?.trello_id;
  console.log("🚀 ~ file: page.tsx:8 ~ Request ~ idTrello:", idTrello)
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
    if(response.ok){
      const data = await response.json();
      const CardsFilter = data.filter((card: any) => card.idBoard === idBoard);
      const CardsFilterDueNotNul = CardsFilter.filter((card: any) => card.due !== null);
      return CardsFilterDueNotNul;
    }
  } catch (error: any) {
    console.log(error)
  }
}

async function Producao() {

  const Trello = await Request();
  console.log("🚀 ~ file: page.tsx:17 ~ Producao ~ Trello:", Trello)



  return (
    <>
      <Box w={'100%'} h={'100vh'}>
        {JSON.stringify(Trello, null, 2)}
        <Box></Box>
        <Box></Box>
      </Box>

    </>
  )
}

export default Producao