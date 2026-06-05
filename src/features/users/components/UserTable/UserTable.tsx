import "./UserTable.css";

import { Button } from "../../../../components/ui/Button/Button";

import type { User } from "../../types/user";

interface UserTableProps {
  users: User[];
}

export const UserTable = ({
  users,
}: UserTableProps) => {
  return (
    <div className="user-table-card">
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>

            <th>Email</th>

            <th className="actions-column">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>
                <div className="action-buttons">
                  <Button>Edit</Button>

                  <Button variant="danger">
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};