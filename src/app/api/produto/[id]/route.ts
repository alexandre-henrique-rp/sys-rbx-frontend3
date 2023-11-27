import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { nextAuthOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request, context: { params: any }) {

  const { params } = context;
  const { id } = params;
  const token: any = process.env.NEXT_PUBLIC_RIBERMAX_PHP_TOKEN;
  const BaseUrl: any = process.env.NEXT_PUBLIC_RIBERMAX_PHP;
  const session = await getServerSession(nextAuthOptions);
  const email: any = session?.user.email;

  try {
    const request = await fetch(`${BaseUrl}/produtos?prodId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Token": `${token}`,
        "Email": `${email}`,
      },
      cache: "no-store"
    });
    const response = await request.json();
    if(request.ok){
      return NextResponse.json(response, { status: 200 });
    }
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(error, { status: 500 });
  }
}