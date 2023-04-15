import { fetchPouleMatches } from "@/lib/api";
import { Card, Center, Flex, Loader, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

declare type PouleProps = {
  poule: API.Poule;
  readonly?: boolean;
}

export const Poule = ({poule, readonly}: PouleProps) => {
  const {isLoading, isError, error, data: matches} = useQuery({
    queryKey: ["poule", "match", poule.id],
    queryFn: () => fetchPouleMatches(poule.id),
    staleTime: 30000,
  });

  const sortedTeams = useMemo(() => poule.teams.sort((t1, t2) => t2.score - t1.score), [poule.teams]);

  return (
    <Card shadow="sm" padding="lg" m='xs' radius="md" withBorder w={"19rem"} style={{overflow: "visible"}}>
      <Card.Section inheritPadding py="xs" withBorder>
        <Title order={4}>{poule.name}</Title>
      </Card.Section>
      <Card.Section inheritPadding py="xs" withBorder>
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
          {sortedTeams.map(t => (
            <Paper key={t.id} shadow="xs" p='xs'>
              <Flex align="center" justify="space-between">
                <Text className="text-cutoff">{t.name}</Text>
                <Text weight={"semibold"}>{t.score}</Text>
              </Flex>
            </Paper>
          ))}
        </SimpleGrid>
      </Card.Section>
      <Card.Section inheritPadding py="xs" withBorder>
        {isLoading && (
          <Center>
            <Stack spacing={"xs"}>
              <Center>
                <Loader />
              </Center>
              <Text italic>Loading poule matches</Text>
            </Stack>
          </Center>
        )}
        {isError && (
          <Center>
            <Stack spacing={"xs"}>
              <Center>
                <AlertTriangle color="orange" />
              </Center>
              <Text>Er is iets misgelopen bij het laden van de matches</Text>
            </Stack>
          </Center>
        )}
      </Card.Section>
    </Card>
  );
};
