import { useMemo, useState } from "react";
import "./UsersPage.css";
import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/ui/Input/Input";
import { Loader } from "../components/ui/Loader/Loader";
import { EmptyState } from "../components/ui/EmptyState/EmptyState";
import { Table } from "../components/Table/Table";
import { Modal } from "../components/ui/Modal/Modal";
import { UserForm } from "../components/UserForm/UserForm";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal/DeleteConfirmationModal";
import type { User } from "../types/user";
import { useUserManagement } from "../hooks/useUserManagement";
import { toast } from "react-toastify";

const headers = ["Name", "Email", "Phone", "Actions"];

export const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const {
    users,

    isLoading,
    error,

    handleSubmit,
    handleDelete,

    isSubmitting,
    isDeleting,
  } = useUserManagement();

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
          onSubmit={(data) =>
            handleSubmit(data, selectedUser, {
              closeModal: () => {
                setSelectedUser(null);
                setIsModalOpen(false);
              },

              onSuccess: (message) => toast.success(message),

              onError: (message) => toast.error(message),
            })
          }
        />
      </Modal>

      <DeleteConfirmationModal
        open={!!userToDelete}
        userName={userToDelete?.name ?? ""}
        isDeleting={isDeleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={() =>
          handleDelete(userToDelete, {
            onSuccess: (message) => {
              setUserToDelete(null);
              toast.success(message);
            },

            onError: (message) => toast.error(message),
          })
        }
      />
    </>
  );
};
