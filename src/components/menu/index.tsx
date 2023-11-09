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
  useToast,
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
  const [externalWindow, setExternalWindow] = useState<any | null>(null);
  const [Fornecedor, setFornecedor] = useState<string | null>(null);
  const [FornecedorId, setFornecedorId] = useState<any | null>(null);
  const [FornecedorSecret, setFornecedorSecret] = useState<any | null>(null);
  const pathname = usePathname();
  const toast = useToast();

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

  useEffect(() => {
    if (externalWindow) {
      const interval = setInterval(() => {
        if (externalWindow.closed) {
          clearInterval(interval);
        } else {
          const newURL = externalWindow.location.href;
          externalWindow.close();
          const match = newURL.match(/code=([^&]+)/);

          if (match) {
            const code = match[1];
            console.log('Valor do código:', code);

            const operacao = async () => {
              try {
                const response = await fetch(`/api/blingAuth/Authorization`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/JSON',
                  },
                  body: JSON.stringify({
                    id: FornecedorId,
                    secret: FornecedorSecret,
                    code: code,
                    fornecedor: Fornecedor
                  }),
                });
                if(!response.ok) {
                  throw new Error('Ocorreu um erro durante a solicitação POST.');
                }
                const retorno = await response.json();
                console.log("🚀 ~ file: index.tsx:78 ~ operacao ~ retorno:", retorno)
                toast({
                  title: 'Sucesso',
                  description: 'Autenticado com sucesso, seu token expira em 6 horas',
                  status: 'success',
                  duration: 9000,
                  isClosable: true
                })
                
              } catch (error) {
                console.log(error);
                throw error;
              }
            };

            operacao();
          }
        }
      }, 1000);
    }
  }, [Fornecedor, FornecedorId, FornecedorSecret, externalWindow, toast]);



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
                    if (response.ok) {
                      const retorno = await response.json();
                      const externalWindow = window.open(retorno.url, '_blank', 'width=600, height=600, location=no');
                      setExternalWindow(externalWindow);
                      setFornecedor(fornecedor);
                      setFornecedorId(retorno.id);
                      setFornecedorSecret(retorno.secret);
                    }
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