import { useState } from "react";
import "./UsersPage.css";
import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/ui/Input/Input";
import { Loader } from "../components/ui/Loader/Loader";
import { EmptyState } from "../components/ui/EmptyState/EmptyState";
import { Table } from "../components/Table/Table";
import { Modal } from "../components/ui/Modal/Modal";
import { UserForm } from "../components/UserForm/UserForm";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useUserManagement } from "../hooks/useUserManagement";
import { useToast } from "../hooks/useToast";
import type { User, UserFormValues } from "../types/user";

const headers = ["Name", "Email", "Phone", "Actions"];

export const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { showSuccess, showError } = useToast();

  const {
    users,

    isLoading,
    error,

    handleUpdateUser,
    handleCreateUser,
    handleDeleteUser,

    isSubmitting,
    isDeleting,
    filteredUsers,
  } = useUserManagement(search);

  const handleSubmit = async (data: UserFormValues) => {
    try {
      if (selectedUser) {
        await handleUpdateUser(selectedUser.id, data);

        showSuccess("User updated successfully");
      } else {
        await handleCreateUser(data);

        showSuccess("User created successfully");
      }

      setSelectedUser(null);
      setIsModalOpen(false);
    } catch {
      showError(
        selectedUser ? "Failed to update user" : "Failed to create user",
      );
    }
  };
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await handleDeleteUser(userToDelete.id);

      setUserToDelete(null);

      showSuccess("User deleted successfully");
    } catch {
      showError("Failed to delete user");
    }
  };

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
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </Modal>

      <DeleteConfirmationModal
        open={!!userToDelete}
        userName={userToDelete?.name ?? ""}
        isDeleting={isDeleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};
