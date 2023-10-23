import axios from "axios";

const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

export const BaseURL = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
})