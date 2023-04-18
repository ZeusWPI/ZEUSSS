import { Poule } from "@/components/poules/Poule";
import { RecentPouleMatchBanner } from "@/components/RecentPouleMatchBanner";
import { fetchPouleInfo } from "@/lib/api";
import { TeamContext } from "@/lib/stores/teamContext";
import { Center, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export const PoulePage = () => {
  const { selectedLeague } = useContext(TeamContext);
  const { isLoading, isError, error, data } = useQuery<API.Poule[], Error>({
    queryKey: ["poules", selectedLeague, "public"],
    queryFn: () => fetchPouleInfo(selectedLeague),
    staleTime: 30000,
  });
  const mobile = useMediaQuery("(max-width: 670px)");

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
    <>
      <RecentPouleMatchBanner />
      <Flex style={{overflow: "auto"}}>
        <Flex justify={mobile ? "center" : "left"}>
          {data.map(p => (
            <Poule key={`poule-${p.id}`} poule={p} readonly />
          ))}
        </Flex>
      </Flex>
    </>
  );
};
