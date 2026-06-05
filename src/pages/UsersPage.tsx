import { useState } from "react";
import "./UsersPage.css";
import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/ui/Input/Input";
import { Loader } from "../components/ui/Loader/Loader";
import { EmptyState } from "../components/ui/EmptyState/EmptyState";
import { Table } from "../components/Table/Table";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../types/user";

export const UsersPage = () => {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading, error } = useUsers();

  const headers = ["Name", "Email", "Phone", "Actions"];

  return (
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

        <Button>Create User</Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <EmptyState title="Failed to load users" />
      ) : users.length === 0 ? (
        <EmptyState title="No Users Found" />
      ) : (
        <Table<User>
          headers={headers}
          data={users}
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
                    <Button>Edit</Button>

                    <Button variant="danger">Delete</Button>
                  </div>
                );

              default:
                return null;
            }
          }}
        />
      )}
    </div>
  );
};
