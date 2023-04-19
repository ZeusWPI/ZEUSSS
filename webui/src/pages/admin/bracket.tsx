import { Bracket } from "@/components/Bracket";
import { fetchBracket } from "@/lib/api";
import { queryClient } from "@/lib/query";
import { TeamContext } from "@/lib/stores/teamContext";
import { Button, Center, Group, Loader, NumberInput, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useContext, useState } from "react";

export const AdminBracketPage = () => {
  const { selectedLeague } = useContext(TeamContext);
  const {
    isLoading,
    isError,
    error,
    data: bracketData,
  } = useQuery<Brackets.TreeNode[] | null, Error>({
    queryKey: ["bracket", selectedLeague, "admin"],
    queryFn: () => fetchBracket(selectedLeague, true),
    staleTime: 30000,
    enabled: !!selectedLeague && selectedLeague !== "",
  });
  const [bracketSize, setBracketSize] = useState(8);

  const onBracketCreation = async () => {
    if (2 ** Math.round(Math.log2(bracketSize)) !== bracketSize) {
      notifications.show({
        message: "De bracket groote moet een macht van 2 zijn (8,16,32,...)",
        color: "red",
      });
      return;
    }
    const resp = await fetch("/api/admin/bracket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: bracketSize,
        league: selectedLeague,
      }),
    });
    const data = await resp.json();
    queryClient.invalidateQueries({queryKey: ["bracket", selectedLeague]});
    if (!resp.ok) {
      notifications.show({
        message: `Failed to generate bracket: ${data?.message ?? resp.statusText}`,
        color: "red",
      });
    }
  };

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
          <Stack>
            <NumberInput
              label={"Amount of teams playing in bracket"}
              description="Should be a power of 2 (eg. 8,16,32,...)"
              value={bracketSize}
              min={8}
              onChange={e => setBracketSize(e === "" ? 8 : e)}
            />
            <Button onClick={onBracketCreation}>Generate Bracket</Button>
          </Stack>
        </Center>
      ) : (
        <Bracket masterNodes={bracketData} />
      )}
    </div>
  );
};
