import { Poule } from "@/components/poules/Poule";
import { fetchPouleInfo } from "@/lib/api";
import { Center, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

export const PoulePage = () => {
  const {isLoading, isError, error, data} = useQuery<API.Poule[], Error>({
    queryKey: ["poules", "public"],
    queryFn: () => fetchPouleInfo()
  });
  const mobile = useMediaQuery("(max-width: 670px)");

  if (isLoading) {
    return (
      <Center>
        <Stack spacing={"xs"}>
          <Center>
            <Loader />
          </Center>
          <Text>
            Fetching poule data
          </Text>
        </Stack>
      </Center>
    );
  }

  if (isError) {
    return (
      <>
        <Title order={3}>
        Failed to retrieve poule information. Try reloading the page
        </Title>
        <Text>
          {error.message}
        </Text>
      </>
    );
  }

  return (
    <Flex wrap={"wrap"} justify={mobile ? "center" : "left"}>
      {data.map(p => <Poule key={`poule-${p.id}`} poule={p} readonly />)}
    </Flex>
  );
};
