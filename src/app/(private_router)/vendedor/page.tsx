import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { VendedorComponent } from "@/components/vendedor/vendedorComponent";
import { getServerSession } from "next-auth";



export default async function vendedor() {
  const session = await getServerSession(nextAuthOptions);
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: 'no-cache',
  });
  const data = await response.json();
  
  return (
    <>
    <VendedorComponent props={{data}} />
    </>
  )
}