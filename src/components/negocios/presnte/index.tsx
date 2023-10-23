'use client';
import FetchRequest from "@/function/fetch/request/route";
import { SetValue } from "@/function/setValue";
import { Td, Tr } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

export const Presente = (props: { user: string }) => {
  const [data, setData] = useState<any>([]);
  const [User, setUser] = useState<string>()


  useEffect(() => {
    (async () => {
      try {
        const response = await FetchRequest.get(
          `/empresas?filters[status][$eq]=true&filters[inativStatus][$eq]=4&filters[user][username][$eq]=${props.user}&fields[0]=nome&fields[1]=ultima_compra&fields[2]=penultima_compra&fields[3]=valor_ultima_compra&fields[4]=inativStatus&fields[5]=inativOk&populate[user][fields][0]=username`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [props.user]);

  const renderedData = useMemo(() => {
    return data.map((i: any) => (
      <Tr key={i.id}>
        <Td py='2' color={'white'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'} textAlign={"center"}>
          {i.attributes.nome}
        </Td>
        <Td py='2' color={'white'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'} textAlign={"center"}>
          {SetValue(i.attributes.valor_ultima_compra)}
        </Td>
      </Tr>
    ));
  }, [data]);

  return <>{renderedData}</>;
};
