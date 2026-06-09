import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";

import type { User } from "../types/user";

// Reusable Hooks

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

//   Stateful Business Hook

export const useUserManagement = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  //     Query

  const { data: users = [], isLoading, error } = useUsers();

  //     Mutations

  const createUserMutation = useCreateUser();

  const updateUserMutation = useUpdateUser();

  const deleteUserMutation = useDeleteUser();

  //   Derived State

  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

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
  }, [users, search]);

  //   Toast

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  //   Modal Actions

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  //   Submit

  const handleSubmit = (data: {
    name: string;
    email: string;
    phone: string;
  }) => {
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

            setToast({
              message: "User updated successfully",
              type: "success",
            });

            closeModal();
          },

          onError: () => {
            setToast({
              message: "Failed to update user",
              type: "error",
            });
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

        setToast({
          message: "User created successfully",
          type: "success",
        });

        closeModal();
      },

      onError: () => {
        setToast({
          message: "Failed to create user",
          type: "error",
        });
      },
    });
  };

  //   Delete

  const handleDelete = () => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });

        setToast({
          message: "User deleted successfully",
          type: "success",
        });

        setUserToDelete(null);
      },

      onError: () => {
        setToast({
          message: "Failed to delete user",
          type: "error",
        });
      },
    });
  };

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  const isDeleting = deleteUserMutation.isPending;

  return {
    users,
    filteredUsers,

    isLoading,
    error,

    search,
    setSearch,

    toast,

    isModalOpen,
    selectedUser,

    userToDelete,
    setUserToDelete,

    openCreateModal,
    openEditModal,
    closeModal,

    handleSubmit,
    handleDelete,

    isSubmitting,
    isDeleting,
  };
};
