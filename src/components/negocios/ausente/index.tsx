import { Td, Tr } from "@chakra-ui/react";
import { ReactNode } from "react";

export async function UserRequest(user: any) {
  const request = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/empresas?filters[status][$eq]=true&filters[inativStatus][$eq]=2&filters[user][username][$eq]=${user}&fields[0]=nome&fields[1]=ultima_compra&fields[2]=penultima_compra&fields[3]=valor_ultima_compra&fields[4]=inativStatus&fields[5]=inativOk`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });
  const response = await request.json();
  return response.data;
}


interface Props {
  Usuario: ReactNode
}



async function Ausente({ Usuario }: Props) {
  const response = await UserRequest(Usuario);

  return (
    <>
      {!!response && response.map((i: any) => {
        const DataAtualizada = new Date(i.attributes.ultima_compra);
        DataAtualizada.setDate(DataAtualizada.getDate() + 1);
        return (
          <Tr key={i.id}>
            <Td py='2' color={'white'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'} textAlign={"center"}>
              {i.attributes.nome}
            </Td>
            <Td py='2' color={'white'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'} textAlign={'center'}>
              {DataAtualizada.toLocaleDateString('pt-BR')}
            </Td>
          </Tr>
        )
      })}
    </>
  )
};

export default Ausente;