import { Poule } from "@/components/poules/Poule";
import { fetchPouleInfo } from "@/lib/api";
import { Center, Container, Flex, Loader, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export const PoulePage = () => {
  const {isLoading, isError, error, data} = useQuery<API.Poule[], Error>({
    queryKey: ["poules", "public"],
    queryFn: () => fetchPouleInfo()
  });

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
    <Flex wrap={"wrap"}>
      {data.map(p => <Poule key={`poule-${p.id}`} poule={p} readonly />)}
    </Flex>
  );
};
