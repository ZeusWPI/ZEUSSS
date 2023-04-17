import { NavBar } from "@/components/NavBar";

const barEntries = [
  {
    link: "/poules",
    name: "Poules",
  },
  {
    link: "/bracket",
    name: "Bracket",
  },
];

export const PublicNavBar = () => {
  return <NavBar links={barEntries} />;
};
