'use client';
import Loading from "@/app/loading";
import { BodyChat } from "@/components/negocios/bobychat";
import { NegocioFooter } from "@/components/negocios/negocioFooter";
import { NegocioHeader } from "@/components/negocios/negocioHeader";
import { Box, Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface InfosParams {
  params: {
    id: string;
  }
}

async function GetRequest(id: string) {
  const request = await fetch(`/api/negocio/get/${id}`);
  const response = await request.json();
  return response;
}


export default function CreateNegocio({ params }: InfosParams) {
  const id: any = params.id;
  const toast = useToast();
  const divRef = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState([]);
  const [msg2, setMsg2] = useState(false);
  const [loadingGeral, setLoadingGeral] = useState(true);
  const [loading, setLoading] = useState(false);
  const [nBusiness, setnBusiness] = useState("");
  const [Approach, setApproach] = useState("");
  const [Budget, setBudget] = useState("");
  const [Status, setStatus] = useState("");
  const [Deadline, setDeadline] = useState("");
  const [DataRetorno, setDataRetorno] = useState("");
  const [Nome, setNome] = useState<string>("");
  const [Historia, setHistoria] = useState([]);
  const [ChatHistory, setChatHistory] = useState([]);
  const [Etapa, setEtapa] = useState<any | null>();
  const [Mperca, setMperca] = useState<any | null>();
  const [Data, setData] = useState<any | null>();

  useEffect(() => {
    const div = divRef.current;
    if (div) {
      setTimeout(() => {
        div.scrollTop = div.scrollHeight;
      }, 0);
    }
  }, [divRef, msg]);

  // recuperar infos do cliente
  useEffect(() => {
    (async () => {
      try {
        const res = await GetRequest(id);
        setData(res)
        setnBusiness(res.attributes.nBusiness);
        setApproach(res.attributes.Approach);
        setBudget(res.attributes.Budget);
        setStatus(res.attributes.andamento);
        setDeadline(res.attributes.deadline);
        setDataRetorno(res.attributes.DataRetorno);
        setHistoria(res.attributes.history);
        setChatHistory(res.attributes.incidentRecord);
        setEtapa(res.attributes.etapa);
        setMperca(res.attributes.Mperca);
        setNome(res.attributes.empresa.data.attributes.nome);
        // fim do loading
        setLoadingGeral(false);

      } catch (error: any) {
        console.log(error);
        toast({
          title: "Ops",
          description: "erro ao recuperar as informações iniciais \n" + JSON.stringify(error, null, 2),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        // fim do loading
        setLoadingGeral(false);
      };
    })();
  }, [id, toast]);

  useEffect(() => {
    if (msg) {
      (async () => {
        try {
          const res = await GetRequest(id);
          setChatHistory(res.attributes.incidentRecord);
          // fim do loading
          setLoading(false);
        } catch (error: any) {
          console.log(error);
          toast({
            title: "Ops",
            description: "erro ao recuperar as informações \n" + JSON.stringify(error, null, 2),
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          // fim do loading
          setLoading(false);
        };
      })();
    }
  }, [id, msg, toast]);

  useEffect(() => {
    if (msg2) {
      (async () => {
        setLoading(true);
        try {
          const res = await GetRequest(id);
          setChatHistory(res.attributes.incidentRecord);
          // fim do loading
          setLoading(false);
          setMsg2(false)
        } catch (error: any) {
          console.log(error);
          toast({
            title: "Ops",
            description: "erro ao recuperar as informações \n" + JSON.stringify(error, null, 2),
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          // fim do loading
          setLoading(false);
          setMsg2(false)
        };
      })();
    }
  }, [id, msg2, toast]);

  function getMsg(menssage: React.SetStateAction<any>) {
    setMsg(menssage);
  }
  async function chatRelaod(menssage: React.SetStateAction<any>) {
    setLoadingGeral(true);
    setMsg2(menssage);
    try {
      const res = await GetRequest(id);
      setData(res.data)
      setnBusiness(res.data.attributes.nBusiness);
      setApproach(res.data.attributes.Approach);
      setBudget(res.data.attributes.Budget);
      setStatus(res.data.attributes.andamento);
      setDeadline(res.data.attributes.deadline);
      setDataRetorno(res.data.attributes.DataRetorno);
      setHistoria(res.data.attributes.history);
      setChatHistory(res.data.attributes.incidentRecord);
      setEtapa(res.data.attributes.etapa);
      setMperca(res.data.attributes.Mperca);
      setNome(res.data.attributes.empresa.data.attributes.nome);
      // fim do loading
      setLoadingGeral(false);

    } catch (error: any) {
      console.log(error);
      toast({
        title: "Ops",
        description: "erro ao recuperar as informações \n" + JSON.stringify(error, null, 2),
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      // fim do loading
      setLoadingGeral(false);
    };
  }
  function getLoad(lading: React.SetStateAction<any>) {
    setLoadingGeral(lading);
  }

  if (loadingGeral) {
    return (
      <Box w={'100%'} h={'100%'}>
        <Loading />
      </Box>
    );
  }

  return (
    <>
      <Flex w="100%" h="100vh" flexDirection={'column'} justifyContent={'space-between'} bg={'gray.800'} >
        <Box  w="full" p={5} color={'white'}>
          <NegocioHeader
            id={id}
            title={Nome}
            nBusiness={nBusiness}
            Approach={Approach}
            Budget={Budget}
            Status={Status}
            Deadline={Deadline}
            historia={Historia}
            DataRetorno={DataRetorno}
            Mperca={Mperca}
            etapa={Etapa}
            onLoad={getLoad}
            chat={ChatHistory}
            onchat={chatRelaod}
            onData={Data}
          />
        </Box>
        <Box bg={'#292f3a'} w="full" h={'full'} ref={divRef} overflowY={"auto"}>
          <BodyChat conteudo={ChatHistory} loading={loading} />
        </Box>
        <Box bg={'gray.800'} w="full">
          <NegocioFooter id={id} data={ChatHistory} onGetValue={getMsg} />
        </Box>
      </Flex>
    </>
  );
}
