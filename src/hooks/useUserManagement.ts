import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../services/userService";

import type { User, UserFormValues } from "../types/user";

//  Business logic for user management

export const useUserManagement = (search: string) => {
  const queryClient = useQueryClient();
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

  const handleSubmit = (
    data: UserFormValues,
    selectedUser: User | null,
    callbacks: {
      onSuccess: () => void;
      onError: () => void;
    },
  ) => {
    if (selectedUser) {
      updateUserMutation.mutate(
        {
          id: selectedUser.id,
          user: data,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["users"],
            });

            callbacks.onSuccess();
          },

          onError: () => {
            callbacks.onError();
          },
        },
      );

      return;
    }

    createUserMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });

        callbacks.onSuccess();
      },

      onError: () => {
        callbacks.onError();
      },
    });
  };

  const handleDelete = (
    userToDelete: User | null,
    callbacks: {
      onSuccess: () => void;
      onError: () => void;
    },
  ) => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });

        callbacks.onSuccess();
      },

      onError: () => {
        callbacks.onError();
      },
    });
  };

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  const isDeleting = deleteUserMutation.isPending;

  return {
    users,

    isLoading,
    error,

    handleSubmit,
    handleDelete,

    isSubmitting,
    isDeleting,
    filteredUsers,
  };
};
