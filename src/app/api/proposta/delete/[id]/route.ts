import { NextResponse } from "next/server";


export async function DELETE(request: Request, context: { params: any }) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const BaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const { params } = context;
    const id = params.id;

    const response = await fetch(`${BaseUrl}/pedidos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });
    if(response.ok){
      return NextResponse.json({ message: `Proposta de id ${id} foi deletada` }, { status: 200 });
    }
    
  } catch (error: any) {
    console.error(!error.response.data.error ? error : error.response.data)
    return NextResponse.json(!error.response.data.error ? error : error.response.data, { status: 500 });
    
  } 
}