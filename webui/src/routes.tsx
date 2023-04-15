import { createBrowserRouter } from "react-router-dom";
import { MainPage } from "./pages";
import { AdminNavBar } from "./pages/admin/navbar";
import { AdminPoulesPage } from "./pages/admin/poules";
import { TeamAdminPage } from "./pages/admin/teams";
import { LeagueSelectionOverlay } from "./pages/leagueSelectionOverlay";
import { PublicNavBar } from "./pages/navbar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LeagueSelectionOverlay />,
    children: [
      {
        index: true,
        element: <MainPage />
      },
      {
        path: "/",
        element: <PublicNavBar />,
      },
      {
        path: "admin",
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
    ]
  },
]);
