import { queryClient } from "@/lib/query";
import { TeamContext } from "@/lib/stores/teamContext";
import { Button, Card, Flex, SimpleGrid, Text, Title, Paper, ActionIcon, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { XIcon } from "lucide-react";
import { useContext, useState } from "react";
import { TeamSelectionBox } from "../TeamSelectionBox";

export const NewPoule = ({ index, assignedTeams }: { index: number; assignedTeams: Team[] }) => {
  const { selectedLeague } = useContext(TeamContext);
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState(`Poule ${index}`);
  const [teamToAdd, setTeamToAdd] = useState<Team | undefined>(undefined);

  const createPoule = async () => {
    if (!selectedLeague) return;
    if (name.trim() === "") {
      notifications.show({
        message: "Poule name mag niet leeg zijn",
        color: "red",
      });
      return;
    }
    if (teams.length < 2) {
      notifications.show({
        message: "Een poule moet minsten 2 teams hebben",
        color: "red",
      });
      return;
    }
    const resp = await fetch("/api/poules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        league: selectedLeague,
        teams: teams.map(t => t.id),
      }),
    });
    const data = await resp.json();
    queryClient.invalidateQueries(["poules"]);
    if (!resp.ok) {
      notifications.show({
        message: `Er is iets fout gelopen tijdens het creeren van de poule: ${data?.message ?? resp.statusText}`,
        color: "red",
      });
    }
  };

  const onTeamAddClick = () => {
    if (!teamToAdd) return;
    setTeams(ts => [...ts, teamToAdd]);
    setTeamToAdd(undefined);
  };

  const onTeamRemoveClick = (id: number) => {
    setTeams(ts => ts.filter(t => t.id !== id));
  };

  return (
    <Card shadow="sm" padding="lg" m="xs" radius="md" withBorder w={"19rem"} style={{ overflow: "visible" }}>
      <Card.Section inheritPadding py="xs" withBorder>
        <TextInput placeholder="Poule name" value={name} onChange={e => setName(e.currentTarget.value ?? "")} />
      </Card.Section>
      <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs" mt="xs">
        {teams.map(t => (
          <Paper key={t.id} shadow="xs" p="xs">
            <Flex align="center" justify="space-between">
              <Text className="text-cutoff">{t.name}</Text>
              <ActionIcon onClick={() => onTeamRemoveClick(t.id)}>
                <XIcon size={18} color={"red"} />
              </ActionIcon>
            </Flex>
          </Paper>
        ))}
      </SimpleGrid>
      <Flex align={"flex-end"}>
        <TeamSelectionBox value={teamToAdd} onChange={setTeamToAdd} filter={teams.concat(...assignedTeams)} />
        <Button ml={"xs"} onClick={onTeamAddClick}>
          Add
        </Button>
      </Flex>
      <Button mt={"md"} onClick={createPoule} fullWidth>
        create
      </Button>
    </Card>
  );
};
