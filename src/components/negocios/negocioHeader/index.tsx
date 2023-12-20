'use client';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { BtnStatus } from "@/components/geral/Btstatus";
import { StatusPerca } from "@/data/statusDePerca";
import { EtapasNegocio } from "@/data/etapaNegocio";
import { BtmRetorno } from "@/components/geral/botaoRetorno/page";
import { SetValue } from "@/function/setValue";
// import { pedido } from "";
import formatarDataParaSaoPaulo from "@/function/formatarDataParaSaoPaulo";

export const NegocioHeader = (props: {
  id: any;
  nBusiness: string;
  Approach: string;
  Budget: string;
  title: string;
  Status: any;
  Deadline: string;
  historia?: any;
  DataRetorno?: string;
  etapa?: any;
  Mperca?: any;
  onLoad: any;
  chat: any;
  onchat: any;
  onData: any;
}) => {
  const router = useRouter();
  const ID = props.id;
  const toast = useToast();
  const { data: session } = useSession();
  const [Status, setStatus] = useState<any>();
  const [Etapa, setEtapa] = useState<any>();
  const [Mperca, setMperca] = useState<any>();
  const [Business, setBusiness] = useState("");
  const [Approach, setApproach] = useState("");
  const [Budget, setBudget] = useState<any>();
  const [Deadline, setDeadline] = useState("");
  const [NPedido, setNPedido] = useState("");
  const [Bpedido, setBpedido] = useState("");
  const [DataRetorno, setDataRetorno] = useState<any>();
  const [Data, setData] = useState<any | null>();
  const [PropostaId, setPropostaId] = useState('');
  const [DataItens, setDataItens] = useState<any | null>();
  const [load, setload] = useState<boolean>(false);
  const [BlockSave, setBlockSave] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (props.onData) {
      setData(props.onData)
      setStatus(parseInt(props.Status));
      setBudget(SetValue(props.Budget));
      setDeadline(props.Deadline);
      setBusiness(props.nBusiness);
      setApproach(props.Approach);
      setDataRetorno(!props.DataRetorno ? new Date().toISOString() : props.DataRetorno);
      setMperca(props.Mperca)
      setEtapa(parseInt(props.etapa))
      props.onLoad(false)
      const [pedidos] = props.onData.attributes.pedidos.data
      const nPedido = pedidos?.attributes.nPedido
      setNPedido(nPedido)
      setBpedido(props.onData.attributes.Bpedido)
      const ITENS = pedidos?.attributes
      setPropostaId(props.onData.attributes?.pedidos?.data[0]?.id)
      setDataItens(ITENS?.itens)
      setBlockSave(props.nBusiness && parseInt(props.etapa) === 6 || parseInt(props.Status) === 1 && parseInt(props.etapa) === 6 ? true : false)
    }
  }, [props]);
  const DataAtual = formatarDataParaSaoPaulo(new Date(Date.now()))

  const historicomsg = {
    vendedor: session?.user.name,
    date: DataAtual.toLocaleString(),
    msg: `Vendedor(a) ${session?.user.name}, alterou as informações desse Business`,
  };

  const filtro = StatusPerca.filter((e: any) => e.id == Mperca).map((i: any) => i.title)

  const ChatConcluido = {
    msg: Status === 5 ? `Parabéns, você concluiu esse Negocio com sucesso` : `Negocio perdido, motivo: ${filtro}`,
    date: DataAtual,
    user: "Sistema",
    susseso: Status === 5 ? 'green' : Status === 1 ? 'red' : '',
    flag: Status === 5 ? "Ganho" : 'Perca'
  };

  const history = [...props.historia, historicomsg];

  const Salve = async () => {

    if (Etapa === 6 && Status == 3) {
      toast({
        title: "Esse Negócio não pode ser finalizado",
        description: "Ao concluir um Negócio, é obrigatório definir um status",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: 'top-right'
      });
    } else if (!NPedido && Etapa === 6 && Status === 5 && DataItens.length < 0) {
      toast({
        title: "Esse Negócio não pode ser finalizado",
        description: "para finalizar um negócio, a proposta deve ser gerada e autorizada",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: 'top-right'
      });
    } else {
      const data1 = {
        data: {
          deadline: Deadline,
          nBusiness: Business,
          Budget: SetValue(Budget),
          Approach: Approach,
          history: history,
          etapa: Etapa,
          andamento: Status,
          Mperca: Mperca,
          incidentRecord: [...props.chat, ChatConcluido],
          DataRetorno: DataRetorno,
          date_conclucao: DataAtual
        },
      };

      const data2 = {
        data: {
          deadline: Deadline,
          nBusiness: Business,
          Budget: SetValue(Budget),
          Approach: Approach,
          history: history,
          etapa: Etapa,
          andamento: Status,
          Mperca: Mperca,
          DataRetorno: DataRetorno,
        },
      };

      const data = Etapa === 6 ? data1 : data2;

      try {
        const response = await fetch(`/api/db/business/put/id/${ID}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        if (response.ok) {
          if (NPedido && Etapa === 6 && Status === 5) {
            onOpen()
            setBlockSave(true)
          } else if (Etapa === 6 && Status === 1) {
            toast({
              title: "Atualização feita",
              description: "Infelizmente esse negocio foi perdido",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            props.onchat(true);
            setBlockSave(true)
          } else {
            toast({
              title: "Atualização feita",
              description: "Atualização das informações foi efetuada com sucesso",
              status: "info",
              duration: 9000,
              isClosable: true,
            });
            props.onchat(true);
          }
        }
      } catch (error) {
        props.onchat(true);
        console.error(error);
      }
    }
  };

  const masckValor = (e: any) => {
    const valor = e.target.value.replace('.', '').replace(',', '')
    const valorformat: any = SetValue(valor);
    console.log(valor.length)
    if (valor.length > 15) {
      setBudget(valorformat.slice(-15))
    } else {
      setBudget(valorformat)
    }
  }

  const finalizar = async () => {
    toast({
      title: "Só um momento estou processando!",
      status: "warning",
      isClosable: true,
      position: 'top-right',
    });
    setload(true)
    try {
      const [pedidos] = Data.attributes.pedidos.data
      const nPedido = pedidos?.attributes.nPedido

      const response = await fetch(`/api/pedido/post/${nPedido}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await response.json();
      toast({
        title: "Pedido realizado com sucesso!",
        status: "success",
        duration: 5000,
        position: 'top-right',
      });
      console.log(data)
      onClose()
      setload(false)
      props.onchat(true);
    } catch (error: any) {
      console.log(error)
    }
  }


  function getStatus(statusinf: SetStateAction<any>) {
    setStatus(parseInt(statusinf));
  }

  return (
    <>
      <Flex>
        <Flex gap={8} w={"85%"} flexWrap={"wrap"}>
          <Flex alignItems={"center"}>
            <BtmRetorno Url="/negocios" />
          </Flex>
          <Flex alignItems={"center"}>
            <Heading size={"xs"}>{props.title}</Heading>
          </Flex>
          {Bpedido && Etapa === 6 ? null : (
            <>
              <Box>
                <FormLabel
                  fontSize="xs"
                  fontWeight="md"
                >
                  Data de retorno
                </FormLabel>
                <Input
                  shadow="sm"
                  size="sm"
                  w="full"
                  type={"date"}
                  fontSize="xs"
                  rounded="md"
                  onChange={(e) => setDataRetorno(e.target.value)}
                  value={DataRetorno}
                />
              </Box>
              <Box>
                <FormLabel
                  fontSize="xs"
                  fontWeight="md"
                >
                  Orçamento estimado
                </FormLabel>
                <Input
                  shadow="sm"
                  size="sm"
                  w="full"
                  fontSize="xs"
                  rounded="md"

                  onChange={masckValor}
                  value={Budget}
                />
              </Box>
              <Box>
                <FormLabel
                  fontSize="xs"
                  fontWeight="md"
                >
                  Etapa do Negócio
                </FormLabel>
                <Select
                  shadow="sm"
                  size="sm"
                  w="full"
                  fontSize="xs"
                  rounded="md"
                  onChange={(e) => setEtapa(parseInt(e.target.value))}
                  value={Etapa}
                >
                  <option style={{ backgroundColor: "#1A202C" }}></option>
                  {EtapasNegocio.map((i: any) => (
                    <option style={{ backgroundColor: "#1A202C" }} key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </Select>
              </Box>
              {Etapa === 6 && (
                <>
                  <Box>
                    <BtnStatus Resp={props.Status} onAddResp={getStatus} omPedidos={Data.attributes.pedidos.data} />
                  </Box>
                </>
              )}
              <Box hidden={Status == 1 ? false : true}>
                <FormLabel
                  fontSize="xs"
                  fontWeight="md"
                >
                  Motivo de Perda
                </FormLabel>
                <Select
                  shadow="sm"
                  size="sm"
                  w="full"
                  fontSize="xs"
                  rounded="md"
                  onChange={(e) => setMperca(e.target.value)}
                  value={Mperca}
                >
                  <option style={{ backgroundColor: "#1A202C" }}></option>
                  {StatusPerca.map((i: any) => (
                    <option style={{ backgroundColor: "#1A202C" }} key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </Select>
              </Box>
            </>
          )}
        </Flex>

        <Flex alignItems={"center"} flexWrap={'wrap'} gap={3} w={"25%"}>

          {BlockSave ? null : (
            <>
              <Button colorScheme={"whatsapp"} onClick={Salve}>
                Salvar
              </Button>
            </>
          )}
          {Bpedido && Etapa === 6 || BlockSave ? null : (
            <>
              <Button
                colorScheme={"green"}
                onClick={async () => {
                  if (NPedido && DataItens.length > 0) {
                    router.push("/propostas/update/" + ID)
                  } else {
                    if (PropostaId) {
                      try {
                        const request = await fetch(`/api/proposta/delete/${PropostaId}`, {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          }
                        })
                        const data = await request.json()
                        console.log(data)
                        toast({
                          title: `${data.message}`,
                          status: "success",
                          duration: 9000,
                          isClosable: true,
                          position: 'top-right',
                        })
                        await new Promise(resolve => setTimeout(resolve, 1000))
                        router.push(`/propostas/create/${ID}`);
                      } catch (error) {
                        console.log(error)
                      }
                    } else {
                      router.push(`/propostas/create/${ID}`);
                    }
                  }
                }}
              >
                Proposta
              </Button>

            </>
          )}
          {NPedido && !Bpedido && Status === 5 && Etapa === 6 ? (
            <>
              <Button
                colorScheme={"whatsapp"}
                variant={'solid'}
                onClick={() => {

                  window.open(
                    `/api/proposta/pdf/${NPedido}`,
                    "_blank"
                  )
                }}
              >
                PDF
              </Button>

            </>
          ) : null}

          {NPedido && !Bpedido && Status === 3 && Etapa !== 6 ? (
            <>
              <Button
                colorScheme={"teal"}
                variant={'solid'}
                onClick={() => window.open(
                  `/api/proposta/pdf/${NPedido}`,
                  "_blank"
                )}
              >
                PDF
              </Button>
            </>
          ) : null}
          {Bpedido && Status === 5 && Etapa === 6 ? (
            <>
              <Button
                colorScheme={"teal"}
                variant={'solid'}
                onClick={() => window.open(
                  `/api/proposta/pdf/${NPedido}`,
                  "_blank"
                )}
              >
                PDF
              </Button>
            </>
          ) : null}
          {NPedido && Status === 1 && Etapa === 6 ? (
            <>

              <Button variant={'outline'} colorScheme={"whatsapp"} onClick={Salve}>
                Atualizar
              </Button>

              <Button
                colorScheme={"red"}
                variant={'outline'}
                onClick={() => window.open(
                  `/api/proposta/pdf/${NPedido}`,
                  "_blank"
                )}
              >
                PDF
              </Button>

            </>
          ) : null}
          {session?.user.pemission === 'Adm' && (
            <>
              <Button isDisabled={!NPedido} colorScheme={"linkedin"} onClick={() => onOpen()}>
                Reenviar Pedido
              </Button>
              <Button
                colorScheme={"red"}
                onClick={async () => {
                  try {
                    props.onLoad(true)
                    const response = await fetch(`/api/negocio/delete/${ID}`, {
                      method: 'DELETE',
                      headers: {
                        "Content-Type": "application/json",
                      }
                    })
                    if (response.ok) {
                      toast({
                        title: "Negócio excluído com sucesso!",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                        position: 'top-right',
                      })
                      router.push('/negocios')
                    }
                  } catch (error) {
                    console.log(error)
                  }
                }}
              >
                Excluir
              </Button>
            </>
          )}
        </Flex>
        <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
          />
          <ModalContent bg={'gray.600'}>
            <ModalHeader>Negócio Concluido</ModalHeader>
            {/* <ModalCloseButton /> */}
            <ModalBody>
              <Text>Para finalizar é necessário gerar um pedido para produção!</Text>
            </ModalBody>
            <ModalFooter>
              <Button
                fontSize={'0.8rem'}
                p={3}
                colorScheme={"messenger"}
                isDisabled={load}
                onClick={finalizar}
              >
                Gerar Pedido
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex >
    </>
  );
};
