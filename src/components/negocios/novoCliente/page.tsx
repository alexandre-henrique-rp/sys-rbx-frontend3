'use client';
import FetchRequest from "@/function/fetch/request/route";
import { Td, Tr } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

export const NovoCliente = (props: { user: string }) => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    (async () => {
      if (props.user) {
        try {
          const response2 = await FetchRequest.get(
            `/empresas?filters[status][$eq]=true&filters[inativStatus][$eq]=3&filters[user][username][$eq]=${props.user}&filters[ultima_compra][$notNull]=true&fields[0]=nome&fields[1]=ultima_compra&fields[2]=penultima_compra&fields[3]=valor_ultima_compra&fields[4]=inativStatus&fields[5]=inativOk&fields[6]=createdAt&populate[user][fields][0]=username`
          );
          setData(response2.data);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [props.user]);

  const renderedData = useMemo(() => {
    return data.map((i: any) => {

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
    });
  }, [data]);

  return <>{renderedData}</>;
};
