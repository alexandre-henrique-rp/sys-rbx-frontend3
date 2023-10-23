import { getServerSession } from "next-auth"
import { ReactNode } from "react"
import { nextAuthOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "@/components/menu";


interface PrivateRouterProps {
  children: ReactNode
}

export default async function PrivateRouter({children}: PrivateRouterProps) {
  const session = await getServerSession(nextAuthOptions);
  
  const user = session?.user.name

  if (!user) {
    redirect("/login");
  }

  return (
    <>
    <Flex
      h={'100vh'}
      w={'100vw'}
      flexDir={['column', 'column', 'row']}
      overflow="hidden"
      // maxW="2000px"
      fontSize={'1rem'}
    >
      <Flex
        alignItems="center"
        bg="gray.700"
        flexDir="column"
        minW="150px"
        w={['100%', '100%', '15%', '15%', '15%']}
      >
        <Navbar />
      </Flex>

      <Flex
        flexDir="column"
        h="100vh"
        overflow="auto"
        w={'100%'}
      >
        {children}
      </Flex>
    </Flex>
    </>
  )
}