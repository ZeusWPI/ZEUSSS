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
    <Container p={"xs"} size={"xl"}>
      <Center pb={"xs"}>
        <Group spacing={"xs"}>
          {barEntries.map(entry => (
            <Link to={entry.link} key={entry.link}>
              <Button variant={entry.link === location.pathname ? "light" : "subtle"} size={"sm"} compact>
                <Text>
                  {entry.name}
                </Text>
              </Button>
            </Link>
          ))}
        </Group>
      </Center>
      <Outlet />
    </Container>
  );
};
