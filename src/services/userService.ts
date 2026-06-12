import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { User, UserFormValues } from "../types/user";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`${BASE_URL}/users`);
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await axios.get<User>(`${BASE_URL}/users/${id}`);

  return response.data;
};

export const createUser = async (user: UserFormValues) => {
  const response = await axios.post(`${BASE_URL}/users`, user);
  return response.data;
};

export const updateUser = async ({
  id,
  user,
}: {
  id: number;
  user: UserFormValues;
}) => {
  const response = await axios.put(`${BASE_URL}/users/${id}`, user);

  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/users/${id}`);

  return response.data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUser,
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};
