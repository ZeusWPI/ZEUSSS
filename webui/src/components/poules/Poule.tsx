import { fetchPouleMatches } from "@/lib/api";
import { queryClient } from "@/lib/query";
import {
  Card,
  Center,
  Flex,
  Group,
  Loader,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Divider,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { LocationSelectBox } from "../inputs/LocationSelectBox";

declare type PouleProps = {
  poule: API.Poule;
  readonly?: boolean;
};

export const Poule = ({ poule, readonly }: PouleProps) => {
  const location = useLocation();
  const onAdmin = useMemo(() => location.pathname.startsWith("/admin"), [location]);
  const {
    isLoading,
    isError,
    data: matches,
  } = useQuery({
    queryKey: ["poule", poule.id],
    queryFn: () => fetchPouleMatches(poule.id, onAdmin),
    staleTime: 30000,
  });
  const [editingMatchDate, setEditingMatchDate] = useState<Record<number, Date>>({});
  const theme = useMantineTheme();

  const sortedTeams = useMemo(() => poule.teams.sort((t1, t2) => (t2?.score ?? 0) - (t1?.score ?? 0)), [poule.teams]);

  const updateTeamScore = async (matchId: number, teamId: number, score: number) => {
    if (Number.isNaN(score)) {
      return;
    }
    const resp = await fetch(`/api/admin/poules/${poule.id}/matches/${matchId}/teams/${teamId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
      }),
    });
    const data = await resp.json();
    queryClient.invalidateQueries({queryKey: ["poule", poule.id]});
    if (!resp.ok) {
      notifications.show({
        message: `Failed to update team score, ${teamId} - ${matchId}: ${data?.message ?? resp.statusText}`,
        color: "red",
      });
      return;
    }
  };

  const updateMatchDate = async (matchId: number) => {
    const date = editingMatchDate[matchId];
    if (!date || date.toString() === "Invalid Date") {
      return;
    }
    const resp = await fetch(`/api/admin/poules/${poule.id}/matches/${matchId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: date.toISOString(),
      }),
    });
    const data = await resp.json();
    queryClient.invalidateQueries({queryKey: ["poule", poule.id]});
    if (!resp.ok) {
      notifications.show({
        message: `Failed to update match date, ${matchId}: ${data?.message ?? resp.statusText}`,
        color: "red",
      });
      return;
    }
  };

  const updateMatchLocation = async (matchId: number, location: string) => {
    const resp = await fetch(`/api/admin/poules/${poule.id}/matches/${matchId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location,
      }),
    });
    const data = await resp.json();
    queryClient.invalidateQueries({queryKey: ["poule", poule.id]});
    if (!resp.ok) {
      notifications.show({
        message: `Failed to update match location, ${matchId}: ${data?.message ?? resp.statusText}`,
        color: "red",
      });
      return;
    }
  };

  useEffect(() => {
    if (!matches) return;
    setEditingMatchDate(
      matches.reduce<Record<number, Date>>((dates, match) => {
        dates[match.id] = match.date ?? new Date();
        return dates;
      }, {})
    );
  }, [matches]);

  return (
    <Card shadow="sm" padding="lg" m="xs" radius="md" withBorder w={"19rem"} style={{ overflow: "visible" }}>
      <Card.Section inheritPadding py="xs" withBorder>
        <Title order={4}>{poule.name}</Title>
      </Card.Section>
      <Card.Section inheritPadding py="xs" withBorder bg={theme.colors.vek[7]}>
        <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs">
          {sortedTeams.map(t => (
            <Paper key={t.id} shadow="sm" p="xs">
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
        {matches &&
          matches.map(match => (
            <Paper shadow={"sm"} p="xs" key={`match-${match.id}`} withBorder mb={"xs"}>
              {match.teams.map((mTeam, i) => (
                <>
                  <Group key={`match-${match.id}-team-${mTeam.id}`} position={"apart"}>
                    <Text>{mTeam.name}</Text>
                    {readonly ? (
                      <Text weight={"bold"}>{mTeam.score ?? (match.teams.some(mTeam => mTeam.score !== null) ? 0 : "")}</Text>
                    ) : (
                      <NumberInput
                        min={0}
                        placeholder="score"
                        value={mTeam.score ?? -1}
                        onBlur={v => updateTeamScore(match.id, mTeam.id, Number(v.currentTarget.value))}
                        w={"30%"}
                      />
                    )}
                  </Group>
                  {i < match.teams.length - 1 && (
                    <Flex w="100%" align="center">
                      <Divider miw={"40%"} w={"100%"} my="xs" label="VS" />
                      {(match.date || match.location) && (
                        <Flex align={"center"}>
                          {match.date && (
                            <Text w={"100%"} style={{whiteSpace: "nowrap"}} span ml={2} size={"xs"} align="right">{dayjs(match.date).format("DD/MM/YYYY HH:mm")}</Text>
                          )}
                          {match.location && (
                            <Text span ml={2} size={"xs"} align="right">@{match.location}</Text>
                          )}
                        </Flex>
                      )}
                    </Flex>
                  )}
                </>
              ))}
              {!readonly && (
                <>
                  <DateTimePicker
                    label="Match play moment"
                    value={editingMatchDate[match.id]}
                    onChange={date => setEditingMatchDate(d => ({ ...d, [match.id]: date ?? new Date() }))}
                    submitButtonProps={{
                      onClick: () => updateMatchDate(match.id),
                    }}
                  />
                  <LocationSelectBox value={match.location} onChange={v => updateMatchLocation(match.id, v)} pt={"xs"} />
                </>
              )}
            </Paper>
          ))}
      </Card.Section>
    </Card>
  );
};
