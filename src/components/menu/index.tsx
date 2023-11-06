'use client'

import {
  Center,
  Flex,
  Image,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavMenuItems from '../../data/nav-menu-items';
import ProfilePopover from '../profile-popover';
 


function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [Dados, setDados] = useState<any>([]);
  const pathname = usePathname();

  const nameRota = pathname.split('/');
  const RotaAtual = `/${nameRota[1]}`;

  useEffect(() => {
    if (session?.user.primeiro_acesso === true) {
      router.push('/user')
    } else if (session?.user.pemission !== 'Adm') {
      const filtro = NavMenuItems.filter((p: any) => p.permission !== 'Adm');
      setDados(filtro);
    } else {
      setDados(NavMenuItems);
    }
  }, [router, session?.user.pemission, session?.user.primeiro_acesso]);

  return (
    <Flex
      flexDir="column"
      h="100vh"
      justifyContent="space-between"
      display={['none', 'none', 'flex', 'flex', 'flex']}
    >
      <Flex flexDir="column" as="nav">
        <Image
          rounded="5px"
          w="80%"
          m="10%"
          bg={'white'}
          p={3}
          src="https://ribermax.com.br/images/logomarca-h.webp?w=1080&q=75"
          alt="Ribermax Logomarca"
        />
        <Flex flexDir="column" m="10%">
          <List spacing={5}>
            {Dados.map((navItem: any) => {
              if (navItem.id === 6 || navItem.id === 7 || navItem.id === 8) {
                const texto = navItem.text.split(' ')
                const textoFornecedor = texto[texto.length - 1]
                const fornecedor = textoFornecedor.trim()

                const HandleLogin = async () => {
                  try {
                    const response = await fetch(`/api/blingAuth/requisicao?fornecedor=${fornecedor}`, {
                      method: 'GET',
                      headers: {
                        'Content-Type': 'text/html;charset=utf-8',
                      },
                      cache: 'no-store'
                    });
                    const retorno = await response.json();
                    console.log("🚀 ~ file: index.tsx:77 ~ HandleLogin ~ response:", response)
                    console.log("🚀 ~ file: index.tsx:77 ~ HandleLogin ~ retorno:", retorno)
                
                  } catch (error) {
                    console.error(error);
                  }
                };
                


                return (
                  <ListItem key={`navbar-${navItem.id}`}>
                    <Text>
                      <ListIcon fontSize="2xl" color="lime" as={navItem.icon} />
                      <NextLink href='' onClick={() => HandleLogin()}>
                        <Link
                          fontSize="lg"
                          color={'whiteAlpha.800'}
                        >
                          {navItem.text}
                        </Link>
                      </NextLink>
                    </Text>
                  </ListItem>

                )
              } else {
                return (
                  <ListItem key={`navbar-${navItem.id}`}>
                    <Text>
                      <ListIcon fontSize="2xl" color="lime" as={navItem.icon} />
                      <NextLink href={navItem.url} as={navItem.url} passHref>
                        <Link
                          fontSize="lg"
                          color={
                            RotaAtual === navItem.url
                              ? 'lime'
                              : 'whiteAlpha.800'
                          }
                        >
                          {navItem.text}
                        </Link>
                      </NextLink>
                    </Text>
                  </ListItem>
                )
              }
            })}
          </List>
        </Flex>
      </Flex>

      <Center my="15px">
        <ProfilePopover />
      </Center>
    </Flex>
  );
}
export default Navbar;