import axios from "axios";
import type { User } from "../types/user";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`${BASE_URL}/users`);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return response.data;
};
