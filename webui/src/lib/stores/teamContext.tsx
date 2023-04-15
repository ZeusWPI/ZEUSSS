import { useQuery } from "@tanstack/react-query";
import { createContext, FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { fetchTeams } from "../api";
import { Center, Stack, Text, Loader } from "@mantine/core";

declare type TeamContextType = {
  teams: Team[];
  leagues: string[];
  selectedLeague: string;
  getTeam: (id: number) => Team | undefined;
  chooseLeague: (league: string) => void;
};

export const TeamContext = createContext<TeamContextType>({
  teams: [],
  leagues: [],
  selectedLeague: "",
  getTeam: _id => undefined,
  chooseLeague: _league => undefined,
});

export const TeamContextProvider: FC<PropsWithChildren<object>> = ({ children }) => {
  const { data, isLoading, isError, error } = useQuery<Team[], Error>({
    queryKey: ["teams"],
    queryFn: () => fetchTeams(),
  });
  const [selectedLeague, setSelectedLeague] = useState("");

  const getTeam = (id: number) => {
    return (data ?? []).find(t => t.id === id);
  };

  const leagues = useMemo(() => {
    if (!data) return [];
    const leagues: string[] = [];
    data?.forEach(team => {
      if (leagues.includes(team.league)) return;
      leagues.push(team.league);
    });
    return leagues;
  }, [data]);

  useEffect(() => {
    if (!selectedLeague || !leagues.includes(selectedLeague)) {
      setSelectedLeague(leagues[0]);
    }
  }, [leagues]);

  return (
    <TeamContext.Provider
      value={{
        getTeam,
        teams: data ?? [],
        selectedLeague,
        leagues,
        chooseLeague: setSelectedLeague,
      }}
    >
      {isError && (
        <div>
          <p>
            <>Failed to load teams: {error}</>
          </p>
          <p>Reload the site</p>
        </div>
      )}
      {isLoading && (
        <Center pt="xs">
          <Stack spacing={"xs"}>
            <Center>
              <Loader color="vek" />
            </Center>
            <Text>Loading teams...</Text>
          </Stack>
        </Center>
      )}
      {!isError && !isLoading && children}
    </TeamContext.Provider>
  );
};
