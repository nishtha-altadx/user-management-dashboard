import { useState } from "react";
import "./UsersPage.css";
import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/ui/Input/Input";
import { Loader } from "../components/ui/Loader/Loader";
import { EmptyState } from "../components/ui/EmptyState/EmptyState";
import { Table } from "../components/Table/Table";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../types/user";
import { Modal } from "../components/ui/Modal/Modal";
import { UserForm } from "../components/UserForm/UserForm";
import { useCreateUser } from "../hooks/useCreateUsers";
import { useEffect, useMemo } from "react";
import { Toast } from "../components/ui/Toast/Toast";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useDeleteUser } from "../hooks/useDeleteUsers";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal/DeleteConfirmationModal";

export const UsersPage = () => {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading, error } = useUsers();
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
  const [formKey, setFormKey] = useState(0);
  const headers = ["Name", "Email", "Phone", "Actions"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>User Management Dashboard</h1>

            <p>Manage users efficiently</p>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-container">
            <Input
              value={search}
              placeholder="Search users..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
          >
            Create User
          </Button>
        </div>

        <div
          style={{
            marginBottom: "20px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Showing {filteredUsers.length} of {users.length} users
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <EmptyState title="Failed to load users" />
        ) : users.length === 0 ? (
          <EmptyState title="No Users Found" />
        ) : filteredUsers.length === 0 ? (
          <EmptyState title="No Matching Users" />
        ) : (
          <Table<User>
            headers={headers}
            data={filteredUsers}
            renderCell={(user, column) => {
              switch (column) {
                case "Name":
                  return user.name;

                case "Email":
                  return user.email;

                case "Phone":
                  return user.phone;

                case "Actions":
                  return (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Button
                        onClick={() => {
                          setSelectedUser(user);

                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => setUserToDelete(user)}
                      >
                        Delete
                      </Button>
                    </div>
                  );

                default:
                  return null;
              }
            }}
          />
        )}
      </div>

      <Modal
        open={isModalOpen}
        title={selectedUser ? "Edit User" : "Create User"}
        onClose={() => {
          setSelectedUser(null);
          setIsModalOpen(false);
        }}
      >
        <UserForm
          key={selectedUser?.id ?? "create"}
          initialValues={
            selectedUser
              ? {
                  name: selectedUser.name,
                  email: selectedUser.email,
                  phone: selectedUser.phone,
                }
              : undefined
          }
          isSubmitting={
            createUserMutation.isPending || updateUserMutation.isPending
          }
          onSubmit={(data) => {
            if (selectedUser) {
              updateUserMutation.mutate(
                {
                  id: selectedUser.id,
                  user: data,
                },
                {
                  onSuccess: () => {
                    setToast({
                      message: "User updated successfully",
                      type: "success",
                    });

                    setSelectedUser(null);

                    setFormKey((prev) => prev + 1);

                    setIsModalOpen(false);
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
                setToast({
                  message: "User created successfully",
                  type: "success",
                });

                setFormKey((prev) => prev + 1);

                setIsModalOpen(false);
              },

              onError: () => {
                setToast({
                  message: "Failed to create user",
                  type: "error",
                });
              },
            });
          }}
        />
      </Modal>

      <DeleteConfirmationModal
        open={!!userToDelete}
        userName={userToDelete?.name ?? ""}
        isDeleting={deleteUserMutation.isPending}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (!userToDelete) return;

          deleteUserMutation.mutate(userToDelete.id, {
            onSuccess: () => {
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
        }}
      />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
};
