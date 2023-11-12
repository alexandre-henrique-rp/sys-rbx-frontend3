import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
  const session = await getServerSession(nextAuthOptions);
  const idTrello = session?.user?.trello_id;
  try {
    const token: any = process.env.TRELLO_TOKEN;
    const KEY: any = process.env.TRELLO_KEY;
    const BaseUrl: any = process.env.TRELLO_BASEURL;
    const idBoard: any = process.env.TRELLO_BOARDID;
    const response = await fetch(`${BaseUrl}/members/${idTrello}/cards?key=${KEY}&token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    if(response.ok){
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(error, { status: 500 });
  }
}