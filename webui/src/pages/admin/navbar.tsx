import { NavBar } from "@/components/NavBar";

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
    link: "/admin/bracket",
    name: "Bracket"
  },
];

export const AdminNavBar = () => {
  return (
    <NavBar links={barEntries} />
  );
};
