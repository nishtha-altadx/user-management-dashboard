import axios from "axios";

import type { User } from "../types/user";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`${BASE_URL}/users`);

  return response.data;
};

export const createUser = async (user: {
  name: string;
  email: string;
  phone: string;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await axios.post(`${BASE_URL}/users`, user);

  return response.data;
};

export const updateUser = async ({
  id,
  user,
}: {
  id: number;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await axios.put(`${BASE_URL}/users/${id}`, user);

  return response.data;
};

export const deleteUser = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await axios.delete(`${BASE_URL}/users/${id}`);

  return response.data;
};
