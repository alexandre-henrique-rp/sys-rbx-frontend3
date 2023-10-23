import { Center, CircularProgress, Flex, Heading } from '@chakra-ui/react';

function LoadingComponents(props: any) {
  const pageProps = { ...props },
    { children } = pageProps;
  delete pageProps.children;

  return (
    <Flex w={'100%'} h={'100%'} bg={'gray.800'} flexDir="column" justifyContent={'center'} alignItems={'center'}>
      <Center>
        <CircularProgress color="green.500" isIndeterminate {...pageProps} />
      </Center>

      <Center mt="30px">
        <Heading color="white" variant="H1">
          {children}
        </Heading>
      </Center>
    </Flex>
  );
}

export default LoadingComponents;