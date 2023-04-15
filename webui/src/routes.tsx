import { createBrowserRouter } from "react-router-dom";
import { MainPage } from "./pages";
import { AdminNavBar } from "./pages/admin/navbar";
import { AdminPoulesPage } from "./pages/admin/poules";
import { TeamAdminPage } from "./pages/admin/teams";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/admin",
    element: <AdminNavBar />,
    children: [
      {
        path: "teams",
        element: <TeamAdminPage />
      },
      {
        path: "poules",
        element: <AdminPoulesPage />
      }
    ]
  }
]);
