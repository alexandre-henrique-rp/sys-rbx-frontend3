
import FetchRequest from "@/function/fetch/request/route";
import { SetValue } from "@/function/setValue";
import { Td, Tr } from "@chakra-ui/react";
import { useEffect, useMemo, useState, ReactNode } from "react";

interface PresenteProps {
  Usuario: ReactNode
}

async function UserRequest(user: any) {
  try {
    const BaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    const response = await fetch(`${BaseUrl}/empresas?filters[status][$eq]=true&filters[inativStatus][$eq]=4&filters[user][username][$eq]=${user}&fields[0]=nome&fields[1]=ultima_compra&fields[2]=penultima_compra&fields[3]=valor_ultima_compra&fields[4]=inativStatus&fields[5]=inativOk&populate[user][fields][0]=username`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    const data = await response.json();
    return data.data;
  } catch (error: any) {
    console.log(error);
  }
}

async function Presente({ Usuario }: PresenteProps) {
  const response = await UserRequest(Usuario);

  return (
    <>
      {!!response && response.map((i: any) => {

        return (
          <Tr key={i.id}>
            <Td py='2' color={'white'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'} textAlign={"center"}>
              {i.attributes.nome}
            </Td>
            <Td py='2' color={'white'} fontSize={'12px'} borderBottom={'1px solid #CBD5E0'} textAlign={"center"}>
              {SetValue(i.attributes.valor_ultima_compra)}
            </Td>
          </Tr>
        )
      })}
    </>
  );
};

export default Presente;