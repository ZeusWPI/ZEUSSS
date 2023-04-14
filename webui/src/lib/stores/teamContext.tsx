import { useQuery } from "@tanstack/react-query";
import { createContext, FC, PropsWithChildren, useMemo } from "react";
import { devTeamBrackets } from "../devData";

declare type TeamContextType = {
  teams: Team[];
  leagues: string[];
  getTeam: (id: number) => Team | undefined;
}

export const TeamContext = createContext<TeamContextType>({
  teams: [],
  leagues: [],
  getTeam: (_id) => undefined,
});

export const TeamContextProvider: FC<PropsWithChildren<object>> = ({children}) => {
  const {data, isLoading, isError, error} = useQuery<Team[], Error>({
    queryKey: ["teams"],
    queryFn: () => devTeamBrackets,
  });

  const getTeam = (id: number) => {
    return (data ?? []).find(t => t.id === id);
  };

  const leagues = useMemo(() => {
    if (!data) return [];
    const leagues: string[] = [];
    data?.forEach(team => {
      if (leagues.includes(team.league)) return;
      leagues.push(team.league);
    } );
    return leagues;
  }, [data]);

  return (
    <TeamContext.Provider value={{
      getTeam,
      teams: data ?? [],
      leagues,
    }}>
      {isError && (
        <div>
          <p><>Failed to load teams: {error}</></p>
          <p>Reload the site</p>
        </div>
      )}
      {isLoading && (
        <div>
          Loading teams...
        </div>
      )}
      {!isError && !isLoading && (
        children
      )}
    </TeamContext.Provider>
  );
};
