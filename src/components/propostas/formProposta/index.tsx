'use client';
import { GetPrazoPg } from "@/components/geral/getPrazo";
import { SetFormaPg } from "@/components/geral/setFormaPg";
import { ListFornecedor } from "@/data/fornecedor";
import { Box, Button, Flex, FormLabel, Heading, Icon, IconButton, Input, Select, Table, TableContainer, Text, Textarea, Th, Thead, Tr, chakra, useToast } from "@chakra-ui/react";
import { color } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsArrowLeftCircleFill, BsTrash } from "react-icons/bs";

const tempo = () => {
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const month = String(currentTime.getMonth() + 1).padStart(2, '0');
  const day = String(currentTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`
};

export const FormProposta = (props: {
  id: any;
  envio: string;
  data: any;
  produtos: any;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [loadingGeral, setLoadingGeral] = useState<boolean>(false);
  const [RelatEnpresa, setRelatEmpresa] = useState([]);
  const [RelatEnpresaId, setRelatEmpresaId] = useState("");
  const [Nome, SetNome] = useState('');
  const [ListItens, setItens] = useState<any>([]);
  const [date, setDate] = useState<string>(tempo());
  console.log("🚀 ~ file: index.tsx:25 ~ date:", date)
  const [DateEntrega, setDateEntrega] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [EmpresaId, setEmpresaId] = useState("");
  const [frete, setFrete] = useState("");
  const [freteCif, setFreteCif] = useState<any>('0.00');
  const [Loja, setLoja] = useState("");
  const [prazo, setPrazo] = useState("");
  const [tipoprazo, setTipoPrazo] = useState("");
  const [totalGeral, setTotalGeral] = useState<any>("");
  const [Desconto, setDesconto] = useState<any>("");
  const [DescontoAdd, setDescontoAdd] = useState('');
  const [saveNegocio, setSaveNegocio] = useState("");
  const [hirtori, setHistory] = useState([]);
  const [MSG, setMSG] = useState([]);
  const [obs, setObs] = useState("");
  const [Id, setId] = useState("");
  const [clientePedido, setClientePedido] = useState("");
  const [RegistroForgpg, setRegistroForgpg] = useState("");
  console.log("🚀 ~ file: formProposta.tsx:71 ~ FormProposta ~ RegistroForgpg:", RegistroForgpg)
  const [RegistroFrete, setRegistroFrete] = useState("");
  const [ENVIO, setEMVIO] = useState("");
  const [incidentRecord, setIncidentRecord] = useState([]);
  const toast = useToast();

  if (!props.data) {
    (async () => {
      toast({
        title: 'Ocorreu um erro',
        description: 'Por favor tente novamente',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // router.back()
    })
  }
  if (!props.produtos) {
    (async () => {
      toast({
        title: 'Empresa sem Produtos',
        description: 'Esta empresa não possui produtos cadastrados, cadastre-os para prosseguir',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // router.push('/produtos')
    })
  }


  useEffect(() => {
    if (props.data) {
      const resp = props.data

      const [PROPOSTA] = resp.attributes?.pedidos.data
      setId(PROPOSTA?.id);
      const verifiqueFrete = ENVIO === 'UPDATE' ? PROPOSTA?.attributes?.frete : resp.attributes.empresa.data.attributes.frete
      setRegistroFrete(resp.attributes.empresa.data.attributes.frete)
      setFrete(verifiqueFrete);
      setDate(PROPOSTA?.attributes?.dataPedido);
      const verifiquePrazo = ENVIO === 'UPDATE' ? PROPOSTA?.attributes?.condi : resp.attributes.empresa.data.attributes.forpg
      setRegistroForgpg(resp.attributes.empresa.data.attributes.forpg)
      setPrazo(verifiquePrazo);
      setRelatEmpresa(resp.attributes?.empresa.data);
      SetNome(resp.attributes.empresa.data.attributes.nome)
      setRelatEmpresaId(resp.attributes?.empresa.data.id);
      setFreteCif(PROPOSTA?.attributes?.valorFrete);
      setLoja(PROPOSTA?.attributes?.fornecedor);
      setObs(PROPOSTA?.attributes?.obs);
      setSaveNegocio(resp.attributes.nBusiness);
      setHistory(resp.attributes.history);
      setMSG(resp.attributes.incidentRecord)
      setClientePedido(PROPOSTA?.attributes?.cliente_pedido)

      setTipoPrazo(resp.attributes.empresa.data.attributes.maxPg)

      setDateEntrega(PROPOSTA?.attributes?.dataEntrega)
      setHistory(resp.attributes.history);
      setCnpj(resp.attributes.empresa.data.attributes.CNPJ)
      setIncidentRecord(resp.attributes.incidentRecord)
      const descontoDb = PROPOSTA?.attributes.descontoAdd
      setDescontoAdd(!descontoDb ? 0.00 : descontoDb.replace(".", "").replace(",", "."))
    }
  }, [ENVIO, props.data]);

  const disbleProd = !prazo || !DateEntrega || !Loja || !frete ? false : true;

  function setPrazoRetorno(prazo: string) {
    setPrazo(prazo);
  }
  function getPrazo(prazo: string) {
    setTipoPrazo(prazo);
  }

  return (
    <>
      <style>
        {`.data-input::-webkit-calendar-picker-indicator {
            filter: invert(1); /* Inverte as cores do ícone */
            /* Outros estilos que desejar aplicar ao ícone */
          }`}
      </style>
      <Flex h="100vh" w="100%" flexDir={"column"} px={'5'} py={1} bg={'gray.800'} color={'white'} justifyContent={'space-between'} >
        <Box w="100%" bg={'gray.800'} mt={3}>
          <Flex gap={3} alignItems={'center'}>
            <IconButton aria-label='voltar' rounded={'3xl'} onClick={() => router.back()} icon={<BsArrowLeftCircleFill size={30} color="#136dcc" />} />
            <Heading size="md">Proposta comercial</Heading>
          </Flex>
          <Box display="flex" flexWrap={'wrap'} gap={5} alignItems="center" mt={3} mx={5}>
            <Box me={2}>
              <FormLabel
                fontSize="xs"
                fontWeight="md"
              >
                Empresa
              </FormLabel>
               <Text w="full">{Nome}</Text>
            </Box>
            <Box me={2}>
              <FormLabel
                fontSize="xs"
                fontWeight="md"
                color="white"
              >
                N° Negócio
              </FormLabel>
              <Text w="full">{saveNegocio}</Text>
            </Box>
            <Box>
              <FormLabel
                fontSize="xs"
                fontWeight="md"
              >
                Data
              </FormLabel>
              <Input
                shadow="sm"
                type={"date"}
                size="xs"
                w="28"
                fontSize="xs"
                rounded="md"
                isDisabled
                _disabled={{ opacity: 100, cursor: "not-allowed" }}
                className="data-input"
                value={date}
              />
            </Box>
            <Box>
              <FormLabel
                fontSize="xs"
                fontWeight="md"
              >
                Data Entrega
              </FormLabel>
              <Input
                shadow="sm"
                type={"date"}
                color={'white'}
                size="xs"
                w="28"
                fontSize="xs"
                rounded="md"
                className="data-input"
                onChange={(e) => setDateEntrega(e.target.value)}
                value={DateEntrega}
              />
            </Box>
            <Box>
              <FormLabel
                fontSize="xs"
                fontWeight="md"
              >
                Fornecedor
              </FormLabel>
              <Select
                shadow="sm"
                size="xs"
                w="28"
                fontSize="xs"
                rounded="md"
                onChange={(e) => setLoja(e.target.value)}
                value={Loja}
              >
                <option style={{ backgroundColor: "#1A202C" }} value=''>
                  Selecione um Fornecedor
                </option>
                {ListFornecedor.map((item) => {
                  return (
                    <option key={item.id} style={{ backgroundColor: "#1A202C" }} value={item.id}>
                      {item.title}
                    </option>
                  );
                })}
              </Select>
            </Box>
            <Box>
              <SetFormaPg id={RelatEnpresaId} retorno={prazo} envio={setPrazoRetorno} Disable={RegistroForgpg && session?.user.pemission !== 'Adm' ? true : false} />
            </Box>
            <Box hidden={prazo === "A Prazo" ? false : true}>
              <GetPrazoPg envio={getPrazo} id={RelatEnpresaId} retorno={tipoprazo} />
            </Box>
            <Box>
              <FormLabel
                fontSize="xs"
                fontWeight="md"
              >
                Frete
              </FormLabel>
              <Select
                shadow="sm"
                size="xs"
                w="24"
                fontSize="xs"
                rounded="md"
                onChange={(e) => setFrete(e.target.value)}
                value={frete}
                isDisabled={RegistroFrete ? true : false}
              >
                <option style={{ backgroundColor: "#1A202C" }}>Selecione um tipo de Frete</option>
                <option style={{ backgroundColor: "#1A202C" }} value="CIF">CIF</option>
                <option style={{ backgroundColor: "#1A202C" }} value="FOB">FOB</option>
              </Select>
            </Box>
            <Box hidden={frete === "CIF" ? false : true}>
              <FormLabel
                fontSize="xs"
                fontWeight="md"
              >
                Valor de Frete
              </FormLabel>
              <Input
                type="text"
                textAlign={"end"}
                size="xs"
                w={24}
                step={'0.01'}
                fontSize="xs"
                rounded="md"
                // onChange={setFreteSave}
                value={freteCif}
              />
            </Box>
            {session?.user.pemission !== 'Adm' ? null : (
              <>
                <Box>
                  <FormLabel
                    fontSize="xs"
                    fontWeight="md"
                  >
                    Desconto Adicional
                  </FormLabel>
                  <Input
                    type="text"
                    textAlign={"end"}
                    size="xs"
                    w={24}
                    fontSize="xs"
                    rounded="md"
                    // onChange={setAdddescont}
                    value={DescontoAdd}
                  />
                </Box>
              </>
            )}
          </Box>
          <Box mt={4}>
            <Heading size="sm">Itens da proposta comercial</Heading>
          </Box>
          <Box display="flex" gap={5} alignItems="center" mt={3} mx={5}>
            {/* {!disbleProd && (<Box w={"300px"} />)}
            {!!disbleProd && (
              <Box w={"300px"} alignItems="center" >
                <ProdutiList Lista={props.produtos} Retorno={getIten} Reload={getLoading}
                />
              </Box>
            )} */}
            <Box alignItems="center">
              <FormLabel
                fontSize="xs"
                fontWeight="md"
              >
                Pedido do Cliente N°:
              </FormLabel>
              <Input
                shadow="sm"
                type={"text"}
                size="xs"
                w="32"
                fontSize="xs"
                rounded="md"
                onChange={(e) => setClientePedido(e.target.value)}
                value={clientePedido}
              />
            </Box>
            <Box w={"40rem"}>
              <Box display="flex" gap={5} alignItems="center">
                <Box w="full">
                  <FormLabel
                    fontSize="xs"
                    fontWeight="md"
                  >
                    Observação
                  </FormLabel>
                  <Textarea
                    w="full"
                    h={"10"}
                    onChange={(e) => setObs(e.target.value)}
                    placeholder="Breve descrição sobre o andamento"
                    size="xs"
                    value={obs}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt={8} w={"100%"} mb={5} bg={'gray.800'}>
            <Box>
              <TableContainer>
                <Table variant='simple'>
                  <Thead>
                    <Tr bg={'#ffffff12'}>
                      <Th px='0' w={"1.3rem"}></Th>
                      <Th px='0' w={"10rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>Item</Th>
                      <Th px='0' w={"5rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        Código
                      </Th>
                      <Th px='0' w={"3rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        Qtd
                      </Th>
                      <Th px='0' w={"5rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        altura
                      </Th>
                      <Th px='0' w={"5rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        largura
                      </Th>
                      <Th px='0' w={"5rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        comprimento
                      </Th>
                      <Th px='0' w={"3rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        Mont.
                      </Th>
                      <Th px='0' w={"3rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        Expo.
                      </Th>
                      <Th px='0' w={"6rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        Preço un
                      </Th>
                      <Th px='0' w={"6rem"} color='white' textAlign={'center'} fontSize={'0.7rem'}>
                        Preço total
                      </Th>
                      <Th px='0' textAlign={"center"} w={"5rem"}>
                        <Icon as={BsTrash} boxSize={4} color={"whatsapp.600"} />
                      </Th>
                    </Tr>
                  </Thead>
                  {/* <TableConteudo
                    Itens={ListItens}
                    loading={loadingTable}
                    returnItem={getItemFinal}
                  /> */}
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} me={10} mb={5} bg={'gray.800'}>
          <Flex gap={20}>
            <chakra.p>
              Total de itens: {!ListItens ? "" : ListItens.length}
            </chakra.p>
            <chakra.p>
              Frete:{" "}
              {!freteCif || freteCif === "" ? "R$ 0,00" : parseFloat(freteCif.replace(".", "").replace(',', '.')).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </chakra.p>
            <chakra.p>Desconto: {Desconto.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}</chakra.p>
            {/* <chakra.p>Valor Total: {(SetValueNumero(freteCif) + totalGeral).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}</chakra.p> */}
          </Flex>
          <Button
            colorScheme={"whatsapp"}
            // onClick={SalvarProdutos} 
            isDisabled={loadingTable}>
            Salvar Proposta
          </Button>
        </Box>
      </Flex>
    </>
  )
}