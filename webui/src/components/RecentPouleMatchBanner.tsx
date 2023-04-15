import { fetchRecentPouleMatches } from "@/lib/api";
import { TeamContext } from "@/lib/stores/teamContext";
import { Center, Flex, Group, Loader, Paper, Text, useMantineTheme } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useContext } from "react";

export const RecentPouleMatchBanner = () => {
  const {selectedLeague} = useContext(TeamContext);
  const {isLoading, isError, error, data} = useQuery<API.Match[], Error>({
    queryKey: ["poules", "recent-matches"],
    queryFn: () => fetchRecentPouleMatches(selectedLeague),
    staleTime: 30000,
  });
  const theme = useMantineTheme();

  return (
    <Paper h={"3rem"} withBorder p="xs">
      {isLoading && (
        <Center>
          <Loader color={"vek"} size="xs" mr='xs' />
          <Text>Loading recent matches</Text>
        </Center>
      )}
      {isError && (
        <Center>
          <AlertTriangle size="1.2rem" color="orange" />
          <Text ml='xs'>Failed to load recent matches: {error.message}</Text>
        </Center>
      )}
      {data && (
        <Flex>
          {data.map(match => (
            <Paper key={`recent-${match.id}`} style={{ backgroundColor: theme.colors.vek[7], flexShrink: "0"}} p={2} mr="xs">
              <Flex align={"center"}>
                <Text color="white" size="sm">{match.teams[0].name}</Text>
                <Text pl={4} color="white" weight={"bold"}>{match.teams[0].score ?? 0}</Text>
                <Text color="white" mx={8} italic>VS</Text>
                <Text pr={4} color="white" weight={"bold"}>{match.teams[1].score ?? 0}</Text>
                <Text color="white" size="sm">{match.teams[1].name}</Text>
              </Flex>
            </Paper>
          ))}
        </Flex>
      )}
    </Paper>
  );
};
