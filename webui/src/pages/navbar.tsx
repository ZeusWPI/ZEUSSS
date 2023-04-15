import { NavBar } from "@/components/NavBar";

const barEntries = [
  {
    link: "/poules",
    name: "Poules"
  },
  {
    link: "/brackets",
    name: "Brackets"
  },
];

export const PublicNavBar = () => {
  return (
    <NavBar links={barEntries} />
  );
};
