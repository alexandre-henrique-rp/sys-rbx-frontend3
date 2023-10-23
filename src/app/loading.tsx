import { Box, Center, CircularProgress, Flex, Heading } from '@chakra-ui/react';

function Loading() {
  

  return (
    <Flex w={'100%'} h={'100vh'} bg={'gray.800'} flexDir="column" justifyContent={'center'} alignItems={'center'}>
      <Box>
      <Center>
        <CircularProgress color="green.500" isIndeterminate size="250px" />
      </Center>

      <Center mt="30px">
        <Heading color="white" variant="H1">
          CARREGANDO ....
        </Heading>
      </Center>
      </Box>
    </Flex>
  );
}

export default Loading;