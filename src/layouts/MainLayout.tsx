import { Outlet, NavLink } from "react-router-dom";
import "./MainLayout.css";

export const MainLayout = () => {
  return (
    <div className="layout">
      <header className="layout-header">
        <h2>User Management</h2>
      </header>

      <div className="layout-body">
        <aside className="layout-sidebar">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Users
          </NavLink>
        </aside>

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
