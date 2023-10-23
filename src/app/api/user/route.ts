import { BaseURL } from "@/function/request";

const GetUser = async() => {
  try {
    const response = await BaseURL(`/users?filters[confirmed][$eq]=true&sort[0]=username%3Adesc&fields[0]=username`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export default GetUser;