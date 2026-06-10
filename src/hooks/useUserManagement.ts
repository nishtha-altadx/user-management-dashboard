import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

import type { User } from "../types/user";

// reusable  hooks

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
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

//  Business logic for user management

export const useUserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useUsers();

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleSubmit = (
    data: {
      name: string;
      email: string;
      phone: string;
    },
    selectedUser: User | null,
    callbacks: {
      onSuccess: (message: string) => void;
      onError: (message: string) => void;
      closeModal: () => void;
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

            callbacks.closeModal();

            callbacks.onSuccess("User updated successfully");
          },

          onError: () => {
            callbacks.onError("Failed to update user");
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

        callbacks.closeModal();

        callbacks.onSuccess("User created successfully");
      },

      onError: () => {
        callbacks.onError("Failed to create user");
      },
    });
  };

  const handleDelete = (
    userToDelete: User | null,
    callbacks: {
      onSuccess: (message: string) => void;
      onError: (message: string) => void;
    },
  ) => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });

        callbacks.onSuccess("User deleted successfully");
      },

      onError: () => {
        callbacks.onError("Failed to delete user");
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
  };
};
