import { Bracket } from "@/components/Bracket";
import { fetchBracket } from "@/lib/api";
import { TeamContext } from "@/lib/stores/teamContext";
import { Center, Group, Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useContext } from "react";

export const BracketPage = () => {
  const { selectedLeague } = useContext(TeamContext);
  const {
    isLoading,
    isError,
    error,
    data: bracketData,
  } = useQuery<Brackets.TreeNode[] | null, Error>({
    queryKey: ["bracket", selectedLeague, "admin"],
    queryFn: () => fetchBracket(selectedLeague),
    staleTime: 30000,
    enabled: !!selectedLeague && selectedLeague !== "",
  });

  if (isLoading) {
    return (
      <Center>
        <Group spacing={"xs"}>
          <Center>
            <Loader color="vek" />
          </Center>
          <Text>Loading bracket data</Text>
        </Group>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center>
        <Group spacing={"xs"}>
          <Center>
            <AlertTriangle color="orange" />
          </Center>
          <Text weight={"bold"}>Failed to load bracket data, try reloading the page</Text>
          <Text>
            {error.message}
            {error.stack}
          </Text>
        </Group>
      </Center>
    );
  }

  return (
    <div>
      {!bracketData || bracketData.length === 0  ? (
        <Center>
          <Text weight="bold">
            The bracket for this league is undecided at the moment
            <br />
            Come check back at a later time!
          </Text>
        </Center>
      ) : (
        <Bracket masterNodes={bracketData} readonly />
      )}
    </div>
  );
};
