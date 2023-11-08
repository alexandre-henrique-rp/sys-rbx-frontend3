

export const DataRequeste = async (urlExterno: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${urlExterno}`
    const request = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    })
    const response = await request.json();
    return response
  } catch (error: any) {
    console.error(error)
    throw error
  }
}