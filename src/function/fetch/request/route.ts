const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
const FetchRequest = {
  get: async (url: string) => {
    try {
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store'
      });
      const response = await requeste.json();
      return response;
    } catch (error) {
      throw error
    }
  },
  getStorage: async (url: string) => {
    try {
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await requeste.json();
      return response;
    } catch (error) {
      throw error
    }
  },
  getRevalidate: async (url: string, time: number) => {
    try {
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: time
        }
      });
      const response = await requeste.json();
      return response;
    } catch (error) {
      throw error
    }
  },
  post: async (url: string, data: any) => {
    try {
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      })
      const response = await requeste.json();
      return response
    } catch (error) {
      throw error
    }
  },
  put: async (url: string, data: any) => {
    try {
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      })
      const response = await requeste.json();
      return response
    } catch (error) {
      throw error
    }
  },
  delete: async (url: string) => {
    try {
      const requeste = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const response = await requeste.json();
      return response
    } catch (error) {
      throw error
    }
  }
}
export default FetchRequest