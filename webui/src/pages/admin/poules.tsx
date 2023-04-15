import { NewPoule } from "@/components/poules/NewPoule";
import { Poule } from "@/components/poules/Poule";
import { fetchPouleInfo } from "@/lib/api";
import { TeamContext } from "@/lib/stores/teamContext";
import { Center, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const AdminPoulesPage = () => {
  const { selectedLeague } = useContext(TeamContext);
  const { isLoading, isError, error, data } = useQuery<API.Poule[], Error>({
    queryKey: ["poules", "admin"],
    queryFn: () => fetchPouleInfo(selectedLeague),
  });

  if (isLoading) {
    return (
      <Center>
        <Stack spacing={"xs"}>
          <Center>
            <Loader />
          </Center>
          <Text>Fetching poule data</Text>
        </Stack>
      </Center>
    );
  }

  if (isError) {
    return (
      <>
        <Title order={3}>Failed to retrieve poule information. Try reloading the page</Title>
        <Text>{error.message}</Text>
      </>
    );
  }

  return (
    <Flex wrap={"wrap"}>
      {data.map(p => (
        <Poule key={`poule-${p.id}`} poule={p} />
      ))}
      <NewPoule index={data.length + 1} assignedTeams={data.map(p => p.teams).flatMap(p => p)} />
    </Flex>
  );
};
