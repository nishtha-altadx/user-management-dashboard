import { useEffect, useMemo, useState } from "react";

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../services/userService";

export const useUserManagement = (search: string) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const { data: users = [], isLoading, error } = useUsers();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

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

    createUserMutation,
    updateUserMutation,
    deleteUserMutation,

    isSubmitting,
    isDeleting,
    filteredUsers,
  };
};
