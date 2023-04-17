import { createBrowserRouter } from "react-router-dom";
import { Header } from "./components/Header";
import { MainPage } from "./pages";
import { AdminBracketPage } from "./pages/admin/bracket";
import { AdminNavBar } from "./pages/admin/navbar";
import { AdminPoulesPage } from "./pages/admin/poules";
import { TeamAdminPage } from "./pages/admin/teams";
import { BracketPage } from "./pages/bracket";
import { PublicNavBar } from "./pages/navbar";
import { PoulePage } from "./pages/poules";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/",
        children: [
          {
            path: "poules",
            element: <PoulePage />,
          },
          {
            path: "bracket",
            element: <BracketPage />,
          },
        ],
      },
      {
        path: "admin",
        children: [
          {
            path: "teams",
            element: <TeamAdminPage />,
          },
          {
            path: "poules",
            element: <AdminPoulesPage />,
          },
          {
            path: "bracket",
            element: <AdminBracketPage />,
          },
        ],
      },
    ],
  },
]);
