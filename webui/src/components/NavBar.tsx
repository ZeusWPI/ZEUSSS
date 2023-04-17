import { Button, Center, Container, Group, Text } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

declare type NavBarProps = {
  links: { name: string; link: string }[];
};

export const NavBar = (props: NavBarProps) => {
  const location = useLocation();

  return (
    <Center>
      <Group spacing={"xs"}>
        {props.links.map(entry => (
          <Link to={entry.link} key={entry.link}>
            <Button variant={entry.link === location.pathname ? "white" : "light"} size={"sm"} compact>
              <Text>{entry.name}</Text>
            </Button>
          </Link>
        ))}
      </Group>
    </Center>
  );
};
