import { useState } from "react";

import "./UsersPage.css";

import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/ui/Input/Input";
import { Loader } from "../components/ui/Loader/Loader";
import { EmptyState } from "../components/ui/EmptyState/EmptyState";

import { UserTable } from "../features/users/components/UserTable/UserTable";

import { useUsers } from "../features/users/hooks/useUsers";

export const UsersPage = () => {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading, error } = useUsers();

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
        <UserTable users={users} />
      )}
    </div>
  );
};
