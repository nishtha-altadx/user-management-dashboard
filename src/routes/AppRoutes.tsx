import { Routes, Route } from "react-router-dom";

import { MainLayout } from "../layouts/MainLayout";

import { DashboardPage } from "../pages/DashboardPage";
import { UsersPage } from "../pages/UsersPage";
import { UserDetailsPage } from "../pages/UserDetailsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/users" element={<UsersPage />} />
      </Route>

      <Route path="/users/:id" element={<UserDetailsPage />} />
    </Routes>
  );
};
