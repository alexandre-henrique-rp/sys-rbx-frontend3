

export const UserRecord = async (vendedor: any) => {
  try {
    const BaseUrl: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${BaseUrl}/users?filters[username][$eq]=${vendedor}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (response.ok) {
      const [data] = await response.json();
      if (data.record) {
        return Number(data.record);
      } else {
        return 0;
      }
    }
  } catch (error: any) {
    throw !error.response.data ? error : error.response.data;
  }
}