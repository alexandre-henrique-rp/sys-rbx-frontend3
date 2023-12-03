'use client';
import { BtmRetorno } from "@/components/geral/botaoRetorno/page";
import { EtapasNegocio } from "@/data/etapaNegocio";
import { ObjContato } from "@/data/objetivos";
import { StatusAndamento } from "@/data/statusAndamento";
import { TipoContato } from "@/data/tipoContato";
import FetchApi from "@/function/fetch/route";
import { MaskCep } from "@/function/mask/cep";
import { MaskCnpj } from "@/function/mask/cnpj";
import { capitalizeWords } from "@/function/mask/string";
import { formatarTelefone } from "@/function/mask/telefone";
import { encontrarObjetoMaisProximoComCor } from "@/function/objetocolor";
import { Box, Divider, Flex, chakra, Heading, IconButton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, FormControl, FormLabel, GridItem, Input, SimpleGrid, Textarea, Select, Link, Switch } from "@chakra-ui/react";
import { parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter, } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit3, FiPlusCircle } from "react-icons/fi";

interface InfosParams {
  params: { id: any };
}
export default function Infos({ params }: InfosParams) {
  const { id } = params;
  const { data: session } = useSession()
  const router = useRouter()

  const [Nome, setNome] = useState('')
  const [Razao, setRazao] = useState('')
  const [Endereço, setEndereço] = useState('')
  const [CNPJ, setCNPJ] = useState('')
  const [Numero, setNumero] = useState('')
  const [Bairro, setBairro] = useState('')
  const [CEP, setCEP] = useState('')
  const [Cidade, setCidade] = useState('')
  const [Uf, setUf] = useState('')
  const [Telefone, setTelefone] = useState('')
  const [Email, setEmail] = useState('')
  const [Tipo, setTipo] = useState('1')
  const [Objetivo, setObjetivo] = useState('1')
  const [Descricao, setDescricao] = useState('')
  const [Proximo, setProximo] = useState('')
  const [Representantes, setRepresentantes] = useState([])
  const [Historico, setHistorico] = useState([])
  const [Negocio, setNegocio] = useState([])
  const [Interacoes, setInteracoes] = useState([])
  const [isHovered, setIsHovered] = useState(false);
  const [StatusAt, setStatusAt] = useState(true);
  const [ItenIndex, setItenIndex] = useState('');
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    (async () => {
      try {
        const request = await FetchApi({ url: `/empresas/${id}?&populate=*`, method: 'GET', isCache: 'no-store' });
        const response = request.data;

        const dadosEntrada: any = !response.attributes?.representantes ? [] : response.attributes?.representantes
        const SemVendedor: any = dadosEntrada.filter((i: any) => i.Vendedor === '' || !i.Vendedor);
        const setVendedor: any = dadosEntrada.filter((i: any) => i.Vendedor === session?.user?.name);
        const setAdm: any = dadosEntrada.filter((i: any) => i.Vendedor === 'Adm');
        const DataArray: any = [...SemVendedor, ...setVendedor, ...setAdm]
        setRepresentantes(!!response.attributes?.representantes && DataArray)
        setNome(response.attributes?.nome)
        setRazao(response.attributes?.razao)
        setEndereço(response.attributes?.endereco)
        setCNPJ(response.attributes?.CNPJ)
        setNumero(response.attributes?.numero)
        setBairro(response.attributes?.bairro)
        setCEP(response.attributes?.cep)
        setCidade(response.attributes?.cidade)
        setUf(response.attributes?.uf)
        setTelefone(response.attributes?.fone)
        setEmail(response.attributes?.email)
        setHistorico(response.attributes?.history.slice(-3))
        setNegocio(response.attributes?.businesses.data.slice(-5))

        if (session?.user.pemission === 'Adm') {
          try {
            const request = await FetchApi({ url: `/representantes?filters[status][$eq]=true&populate[user][fields][0]=username&filters[empresa][id][$eq]=${id}`, method: 'GET', isCache: 'no-store' });
            const dados = request.data;
            setRepresentantes(dados)
            const request2 = await FetchApi({ url: `/interacoes?filters[empresa][nome][$containsi]=${response.attributes?.nome}&populate=*`, method: 'GET', isCache: 'no-store' });
            const response2 = request2.data;
            setInteracoes(response2)
          } catch (error) {
            console.error("Erro ao buscar dados:", error);
          }
        } else {
          try {
            const requestVendedor = await FetchApi({ url: `/representantes?filters[status][$eq]=true&filters[user][username][$eq]=${session?.user.name}&filters[empresa][id][$eq]=${id}&populate[user][fields][0]=username`, method: 'GET', isCache: 'no-store' });
            const dados = requestVendedor.data;
            const requestAdm = await FetchApi({ url: `/representantes?filters[status][$eq]=true&filters[permissao][$eq]=Adm&filters[empresa][id][$eq]=${id}&populate[user][fields][0]=username`, method: 'GET', isCache: 'no-store' });
            const dadosAdm = requestAdm.data;
            const retorno: any = [...dados, ...dadosAdm]

            setRepresentantes(retorno)
            const request2 = await FetchApi({ url: `/interacoes?filters[vendedor][username][$containsi]=${session?.user.name}&filters[empresa][nome][$containsi]=${response.attributes?.nome}&populate=*`, method: 'GET', isCache: 'no-store' });
            const response2 = request2.data;
            setInteracoes(response2)
          } catch (error) {
            console.error("Erro ao buscar dados:", error);
          }
        }
      } catch (error: any) {
        console.log(error)
        toast({
          title: 'Erro.',
          description: JSON.stringify(error.response?.data),
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setTimeout(() => router.push('/empresas'), 1000)
      }
    })()
  }, [id, router, session?.user.name, session?.user.pemission, toast])


  const Save = async () => {
    if (!Proximo) {
      toast({
        title: 'Opss.',
        description: "Interação não pode ser valva, falta definir a data",
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
    } else {
      try {
        const VendedorId = session?.user.id
        const dados: any = {
          data: {
            "vendedor": VendedorId,
            "vendedor_name": session?.user.name,
            "empresa": id,
            "descricao": Descricao,
            "tipo": parseInt(Tipo),
            "objetivo": parseInt(Objetivo),
            "proxima": Proximo,
            "pontual": true,
            "CNPJ": CNPJ,
            "status_atendimento": StatusAt
          }
        }

        const PostInteracao = await FetchApi({ url: `/interacoes`, method: 'POST', data: dados });
        console.log(PostInteracao);
        setDescricao('');
        setTipo('');
        setObjetivo('');
        setProximo('');
        if (session?.user.pemission === 'Adm') {
          const request2 = await FetchApi({ url: `/interacoes?filters[empresa][nome][$containsi]=${Nome}&populate=*`, method: 'GET', isCache: 'no-store' })
          const response2 = request2.data;
          setInteracoes(response2)
        } else {
          const request2 = await FetchApi({ url: `/interacoes?filters[vendedor][username][$containsi]=${session?.user.name}&filters[empresa][nome][$containsi]=${Nome}&populate=*`, method: 'GET', isCache: 'no-store' });
          const response2 = request2.data;
          setInteracoes(response2)
        }
        onClose()

      } catch (error: any) {
        console.log(error)
        toast({
          title: 'Erro.',
          description: JSON.stringify(error.response.data),
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    }
  }

  const vendedor: any = session?.user.name

  const Alert = encontrarObjetoMaisProximoComCor(Interacoes, vendedor)
  const letra = Alert?.cor === 'yellow' ? 'black' : 'white'

  const handleMouseEnter = (i: any) => {
    setIsHovered(true);
    setItenIndex(i)
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setItenIndex('')
  };


  return (
    <>
      <Box minW={'100%'} h={'100vh'} overflow={'auto'} bg={'gray.800'} p={5} fontSize={'0.9rem'} color={'white'}>
        <Flex flexDir={'row'} w={'100%'} h={'10%'} p={5} justifyContent={'space-between'} alignItems={'center'}>
          <Flex gap={5} alignItems={'center'}>
            <Box><BtmRetorno Url="/empresas" /></Box>
            <Heading>{Nome}</Heading>
          </Flex>
          <IconButton
            color={'white'}
            onClick={() => router.push(`/empresas/atualizar/${id}`)}
            colorScheme='messenger'
            aria-label='Editar Empresa'
            icon={<FiEdit3 size={'27px'} />}
          />
        </Flex>

        {/* colunas */}
        <Flex w={'100%'} h={'90%'} justifyContent={'space-between'}>
          <Flex h={'100%'} w={'50%'} flexDir={'column'} gap={3} px={3}>


            {/* constato */}
            <Box w={'100%'} bg={'#2d3748'} rounded={16} p={[3, 3, 5]}>
              <Box><Heading size={'md'}>Contatos</Heading></Box>
              <Box px={[1, 2, 3, 5]} py={3}>

                {!!Representantes && Representantes.map((item: any, index: number) => {
                  const telefone = !item.attributes?.whatsapp ? item.attributes?.telefone : item.attributes?.whatsapp

                  return (
                    <>
                      <Box>
                        <Heading size={'sm'}>{item.attributes?.nome}</Heading>
                        <Flex w={'100%'} p={1}>
                          <Box w={'50%'}>
                            <Flex gap={3}>
                              <chakra.p>Cargo:</chakra.p>
                              <chakra.p>{item.attributes?.cargo}</chakra.p>
                            </Flex>
                            <Flex gap={3}>
                              <chakra.p>Departamento:</chakra.p>
                              <chakra.p>{item.attributes?.departamento}</chakra.p>
                            </Flex>
                          </Box>
                          <Box w={'50%'}>
                            <Flex gap={3}>
                              <chakra.p>Telefone:</chakra.p>
                              {telefone?.length === 11 && (<chakra.a onClick={() => window.open(`https://wa.me//55${item.attributes?.whatsapp}?text=Ola%20${item.attributes?.nome}.%20%20Tudo%20bem?!`, '_blank')} color={'blue.100'} cursor={'pointer'} _hover={{ color: 'blue.500' }} textDecor={'underline'}>{formatarTelefone(telefone)}</chakra.a>)}
                              {telefone?.length < 11 && (<chakra.p>{telefone?.length}{formatarTelefone(telefone)}</chakra.p>)}
                            </Flex>
                            <Flex gap={3}>
                              <chakra.p>E-mail:</chakra.p>
                              <Link href={`mailto:${item.attributes?.email}`} _hover={{ color: 'blue.500' }} textDecor={'underline'} color={'blue.100'}>{item.attributes?.email}</Link>
                            </Flex>
                          </Box>
                        </Flex>
                      </Box>
                      {Representantes.length > 1 && (
                        <>
                          <Divider mb={5} />
                        </>
                      )}
                    </>
                  )
                })}

              </Box>
            </Box>

            {/* dados cadastrais */}
            <Box w={'100%'} bg={'#2d3748'} rounded={16} p={[3, 3, 5]}>
              <Box><Heading size={'md'}>Dados Cadastrais</Heading></Box>
              <Flex w={'100%'} px={[1, 2, 3, 5]} py={[0, 3, 1, 0, 5, 5]} fontSize={'15px'}>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Razão Social: </td>
                      <td> {Razao}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>CNPJ: </td>
                      <td>{MaskCnpj(CNPJ)}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Logradouro: </td>
                      <td>{Endereço}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>N°: </td>
                      <td>{Numero}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Bairro: </td>
                      <td>{Bairro}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Cep; </td>
                      <td>{MaskCep(CEP)}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Cidade: </td>
                      <td>{Cidade}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Uf: </td>
                      <td>{Uf}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Telefone: </td>
                      <td>{formatarTelefone(Telefone)}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>E-mail: </td>
                      <td>{Email}</td>
                    </tr>
                  </tbody>
                </table>
              </Flex>
            </Box>

            {/* historico */}
            <Box w={'100%'} bg={'#2d3748'} rounded={16} p={5}>
              <Box><Heading size={'md'}>Historico</Heading></Box>
              <Flex w={'100%'} h={'80%'} overflowY={'auto'} gap={3} flexDir={'column'}>
                {Historico.map((item: any) => {

                  const Data = new Date(item.date)
                  return (
                    <>
                      <Box>
                        <Box>{Data.toLocaleDateString()}</Box>
                        <Box>Vendedor: {item.vendedor}</Box>
                        <Box>Mensagem: {item.msg}</Box>
                      </Box>

                    </>
                  )
                })}
              </Flex>
            </Box>

          </Flex>

          <Flex h={'100%'} w={'50%'} flexDir={'column'} gap={3} px={3}>

            {/* interações */}
            <Flex flexDir={'column'} justifyContent={'space-between'} w={'100%'} h={'68%'} bg={'#2d3748'} rounded={16} p={5}>
              <Flex flexDir={'row'} justifyContent={'space-between'} alignItems={'center'} pb={3}>
                <Heading size={'md'}>
                  Últimas Interações
                </Heading>
                <IconButton
                  rounded={20}
                  colorScheme='whatsapp'
                  aria-label='Adicionar Interação'
                  icon={<FiPlusCircle size={'27px'} />}
                  onClick={onOpen}
                />
              </Flex>
              <Flex h={'70%'} overflowY={'auto'} flexDir={'column'} gap={3}>
                {Interacoes.map((i: any) => {

                  const [obj] = ObjContato.filter((o: any) => o.id == i.attributes?.objetivo).map((d: any) => d.title)
                  const [tipo] = TipoContato.filter((t: any) => t.id == i.attributes?.tipo).map((d: any) => d.title)
                  const date = new Date(parseISO(i.attributes?.proxima))


                  return (
                    <>
                      <Box bg={'gray.100'} rounded={10} px={5} py={2} color={'black'} fontSize={'0.7rem'}>
                        <Heading size={'sm'}>{obj}</Heading>
                        <chakra.p fontSize={'0.8rem'}>{i.attributes?.descricao}</chakra.p>
                        <Flex justifyContent={'space-between'} mt={1}>
                          <chakra.span p={'0.1rem'} px={'0.3rem'} color={'white'} bg={'blue.400'}>{tipo}</chakra.span>
                          {session?.user.pemission === 'Adm' && (<chakra.p>{i.attributes?.vendedor.data?.attributes?.nome}</chakra.p>)}
                          <chakra.p textDecor={'underline'}>{date.toLocaleDateString()}</chakra.p>
                        </Flex>

                      </Box>
                    </>
                  )
                })}

              </Flex>
              <Box mx={'auto'} mt={3}>
                {!!Alert && (
                  <>
                    <Box bg={Alert?.cor} p={1}>
                      <chakra.p color={letra}>{Alert?.info} {Alert?.data?.toLocaleDateString()}</chakra.p>
                    </Box>
                  </>
                )}
              </Box>
            </Flex>

            {/* últimos negocios */}
            <Box w={'100%'} bg={'#2d3748'} rounded={16} p={5}>
              <Box><Heading size={'md'} mb={3}>Últimos Negocios</Heading></Box>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}></th>
                    <th style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>Etapa</th>
                    <th style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>Status</th>
                    <th style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {Negocio.map((i: any, index: number) => {
                    const valor = !!i.attributes?.Budget && parseFloat(i.attributes?.Budget.replace('.', '').replace(',', '.'))

                    const [Status] = StatusAndamento.filter((s: any) => s.id == i.attributes?.andamento).map((s: any) => s.title)

                    const [andamento] = EtapasNegocio.filter((v: any) => v.id == i.attributes?.etapa).map((v: any) => v.title)

                    const color = i.attributes?.etapa === 6 && i.attributes?.andamento === 1 ? 'red' : i.attributes?.etapa === 6 && i.attributes?.andamento === 5 ? 'green' : 'yellow';

                    const IndexLista = `${index}`

                    return (
                      <>
                        <tr key={i.id} style={{ backgroundColor: isHovered && ItenIndex == IndexLista ? '#ffffff40' : 'transparent', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave} onClick={() => router.push(`/negocios/${i.id}`)}>
                          <td style={{ textAlign: 'center', color: color }}>{index + 1}</td>
                          <td style={{ textAlign: 'center', color: color }}>{andamento}</td>
                          <td style={{ textAlign: 'center', color: color }}>{Status}</td>
                          <td style={{ textAlign: 'center', color: color }}>{!!valor && valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                      </>
                    )
                  })}

                </tbody>
              </table>
              <Flex w={'100%'} h={'90%'} p={2} flexDir={'column'} gap={5} overflowY={'auto'}>

              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent bg={'gray.600'} color={'white'}>
          <ModalHeader>Nova Interação</ModalHeader>
          <Divider />
          <ModalBody mt={3} pb={6}>

            <SimpleGrid
              w={'100%'}
              columns={1}
              spacing={6}
            >

              <SimpleGrid columns={12} spacing={3}>

                <FormControl as={GridItem} colSpan={[12]}>
                  <FormLabel fontSize="xs" fontWeight="md">
                    Tipo de interação
                  </FormLabel>
                  <Select
                    focusBorderColor="#ffff"
                    bg={'gray.600'}
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e) => setTipo(e.target.value)}
                    value={Tipo}
                  >
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'1'}
                    >
                      Notas
                    </chakra.option>
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'2'}
                    >
                      Mensagem de texto
                    </chakra.option>
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'3'}
                    >
                      Chamada por voz
                    </chakra.option>
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'4'}
                    >
                      Mensagem por e-mail
                    </chakra.option>
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'5'}
                    >
                      Contato presencial
                    </chakra.option>
                  </Select>
                </FormControl>

                <FormControl as={GridItem} colSpan={12}>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="md"
                  >
                    Objetivo
                  </FormLabel>
                  <Select
                    focusBorderColor="#ffff"
                    bg={'gray.600'}
                    shadow="sm"
                    size="xs"
                    w="full"
                    rounded="md"
                    onChange={(e) => setObjetivo(e.target.value)}
                    value={Objetivo}
                  >
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'1'}
                    >
                      Sondar decisores
                    </chakra.option>
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'2'}
                    >
                      Aproximação
                    </chakra.option>
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'3'}
                    >
                      Sondar interesses
                    </chakra.option>
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'4'}
                    >
                      Gerar negócio
                    </chakra.option>
                    <chakra.option
                      style={{ backgroundColor: '#4A5568' }}
                      value={'5'}
                    >
                      Resolver problemas
                    </chakra.option>
                  </Select>
                </FormControl>

                <FormControl as={GridItem} colSpan={12}>
                  <Heading as={GridItem} colSpan={12} size="sd">
                    Resumo
                  </Heading>
                  <Box as={GridItem} colSpan={12} >
                    <Textarea
                      borderColor="white"
                      bg={'#ffffff12'}
                      placeholder="Especifique aqui, todos os detalhes do cliente"
                      size="sm"
                      resize={"none"}
                      onChange={(e: any) => setDescricao(capitalizeWords(e.target.value))}
                      value={Descricao}
                    />
                  </Box>
                </FormControl>

                <FormControl as={GridItem} colSpan={12}>
                  <Heading as={GridItem} colSpan={12} size="sd">
                    Status de Contato
                  </Heading>
                  <Box as={GridItem} colSpan={12} >
                    <Switch
                      colorScheme='red'
                      size='sm'
                      isChecked={StatusAt}
                      onChange={(e) => setStatusAt(e.target.checked)}
                    />
                  </Box>
                </FormControl>

                <FormControl as={GridItem} colSpan={12}>
                  <Flex w={'100%'} alignItems={'flex-end'} justifyContent={'space-between'}>
                    <Box>
                      <FormLabel
                        htmlFor="cep"
                        fontSize="xs"
                        fontWeight="md"
                      >
                        Proximo Contato
                      </FormLabel>
                      <Input
                        type="date"
                        focusBorderColor="white"
                        shadow="sm"
                        size="xs"
                        w="full"
                        rounded="md"
                        onChange={(e) => setProximo(e.target.value)}
                        value={Proximo}
                      />
                    </Box>
                    <Flex h={'100%'} gap={5}>
                      <Button colorScheme='blue' onClick={Save}>
                        Save
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </Flex>

                  </Flex>
                </FormControl>

              </SimpleGrid>


            </SimpleGrid>

          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  )
}
