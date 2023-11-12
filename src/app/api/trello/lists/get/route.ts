import { NextResponse } from "next/server";


export async function GET() {
  try {
    const token: any = process.env.TRELLO_TOKEN;
    const KEY: any = process.env.TRELLO_KEY;
    const BaseUrl: any = process.env.TRELLO_BASEURL;
    const idBoard: any = process.env.TRELLO_BOARDID;
    const response = await fetch(`${BaseUrl}/boards/${idBoard}/lists?key=${KEY}&token=${token}&fields=name`, {
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