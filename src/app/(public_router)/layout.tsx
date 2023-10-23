import { getServerSession } from "next-auth"
import { ReactNode } from "react"
import { nextAuthOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";
import { Box } from "@chakra-ui/react";

interface PublicRouterProps {
  children: ReactNode
}

export default async function PublicRouter({ children }: PublicRouterProps) {
  const session = await getServerSession(nextAuthOptions);

  const user = session?.user.name

  if (user) {
    redirect("/");
  }

  return (
    <>
      <Box h={'100vh'} w={'100vw'} fontSize={'1rem'}>
        {children}
      </Box>
    </>
  )
}