import { Td, Tr } from "@chakra-ui/react";

async function EmpresaRequest(user: string) {
  const request = await fetch(`/api/empresa/getEmpresaUser?user=${user}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await request.json();
  return response;
}

interface Props {
  user: string;
}

export const NovoCliente = async ({ user }: Props) => {

  const data = await EmpresaRequest(user);

  const renderedData = data.map((i: any) => {
    return (
      <Tr key={i.id}>
        <Td py='2' color={'white'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'} textAlign={"center"}>
          {i.attributes.nome}
        </Td>
        <Td py='2' color={'white'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'} textAlign={"center"}>
          {new Date(i.attributes.ultima_compra).toLocaleDateString('pt-BR')}
        </Td>
      </Tr>
    )
  })

  return <>{renderedData}</>;
};
