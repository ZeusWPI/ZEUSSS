import { createBrowserRouter } from "react-router-dom";
import { MainPage } from "./pages";
import { AdminBracketPage } from "./pages/admin/bracket";
import { AdminNavBar } from "./pages/admin/navbar";
import { AdminPoulesPage } from "./pages/admin/poules";
import { TeamAdminPage } from "./pages/admin/teams";
import { BracketPage } from "./pages/bracket";
import { LeagueSelectionOverlay } from "./pages/leagueSelectionOverlay";
import { PublicNavBar } from "./pages/navbar";
import { PoulePage } from "./pages/poules";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LeagueSelectionOverlay />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/",
        element: <PublicNavBar />,
        children: [
          {
            path: "poules",
            element: <PoulePage />,
          },
          {
            path:"bracket",
            element: <BracketPage />
          }
        ],
      },
      {
        path: "admin",
        element: <AdminNavBar />,
        children: [
          {
            path: "teams",
            element: <TeamAdminPage />,
          },
          {
            path: "poules",
            element: <AdminPoulesPage />
          },
          {
            path: "bracket",
            element: <AdminBracketPage />
          },
        ],
      },
    ],
  },
]);
