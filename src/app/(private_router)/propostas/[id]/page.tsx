import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CardList } from "@/components/propostas/cardLista/page";
import { BsArrowLeftCircleFill } from "react-icons/bs";

interface InfosParams {
  params: {
    id: string;
  }
}

export default function ListaProposta({ params }: InfosParams) {
  const router = useRouter();
  const ID: any = params.id;
  let Disable: any = false;
  let Load: any = false;

  function getLoading(Loading: boolean | ((prevState: boolean) => boolean)) {
    Load = Loading;
  }
  function getDisable(disable: boolean | ((prevState: boolean) => boolean)) {
    Disable = disable;
  }



  return (
    <>
      <Flex h="100%" w="100%" flexDir={"column"} justifyContent="center" bg={'gray.800'}>
        <Flex
          w="100%"
          justifyContent={"space-between"}
          alignItems={"center"}
          px='10'
          h={"8%"}
        >
          <Box>
            <IconButton aria-label='voltar' rounded={'3xl'} onClick={() => router.push('/negocios/' + ID)} icon={<BsArrowLeftCircleFill size={30} color="#136dcc" />} />
          </Box>
          <Button
            mb={'3'}
            colorScheme="whatsapp"
            isDisabled={Disable}
            onClick={() => {
              localStorage.setItem("id", ID);
              router.push("/propostas/create");
            }}
          >
            Nova Proposta
          </Button>
        </Flex>
        <Box h={"92%"} py='3'>
          <Flex
            bg="gray.800"
            pb={"0.5rem"}
            px={"1rem"}
            h="full"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <CardList id={ID} onloading={getLoading} desbilitar={getDisable} />
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
