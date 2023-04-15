import { NavBar } from "@/components/NavBar";
import { Button, Center, Container, Divider, Group, Text } from "@mantine/core";
import { Link, Outlet, useLocation } from "react-router-dom";

const barEntries = [
  {
    link: "/admin/teams",
    name: "Teams"
  },
  {
    link: "/admin/poules",
    name: "Poules"
  },
  {
    link: "/admin/brackets",
    name: "Brackets"
  },
];

export const AdminNavBar = () => {
  const location = useLocation();
  return (
    <NavBar links={barEntries} />
  );
};
