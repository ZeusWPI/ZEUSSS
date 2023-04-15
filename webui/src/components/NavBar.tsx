import { Button, Center, Container, Group, Text } from "@mantine/core";
import { Link, Outlet, useLocation } from "react-router-dom";

declare type NavBarProps = {
  links: {name: string; link: string}[];
}

export const NavBar = (props: NavBarProps) => {
  const location = useLocation();

  return (
    <Container p={"xs"} size={"xl"}>
      <Center pb={"xs"}>
        <Group spacing={"xs"}>
          {props.links.map(entry => (
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
