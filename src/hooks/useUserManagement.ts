import { useEffect, useMemo, useState } from "react";

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../services/userService";
import { useQueryClient } from "@tanstack/react-query";
import type { UserFormValues } from "../types/user";

export const useUserManagement = (search: string) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data: users = [], isLoading, error } = useUsers();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleUpdateUser = async (id: number, user: UserFormValues) => {
    await updateUserMutation.mutateAsync({ id, user });
    await queryClient.invalidateQueries({
      queryKey: ["users"],
    });
  };

  const handleCreateUser = async (user: UserFormValues) => {
    await createUserMutation.mutateAsync(user);

    await queryClient.invalidateQueries({
      queryKey: ["users"],
    });
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUserMutation.mutateAsync(id);

    await queryClient.invalidateQueries({
      queryKey: ["users"],
    });
  };

  const filteredUsers = useMemo(() => {
    const searchText = debouncedSearch.trim().toLowerCase();

    if (!searchText) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText) ||
        user.phone.toLowerCase().includes(searchText)
      );
    });
  }, [users, debouncedSearch]);

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  const isDeleting = deleteUserMutation.isPending;

  return {
    users,

    isLoading,
    error,

    handleUpdateUser,
    handleCreateUser,
    handleDeleteUser,

    isSubmitting,
    isDeleting,
    filteredUsers,
  };
};
