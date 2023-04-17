import {Bracket as RBracket, Seed, SeedItem, SeedTeam, IRenderSeedProps} from "react-brackets";

import "../styles/bracket.scss";
import { useBracket } from "@/lib/hooks/useBracket";
import { Flex, Text, useMantineTheme } from "@mantine/core";
import { BracketTeamInput } from "./BracketTeamInput";
import { DateTimePicker } from "@mantine/dates";
import { queryClient } from "@/lib/query";
import { useContext, useState } from "react";
import { TeamContext } from "@/lib/stores/teamContext";
import { notifications } from "@mantine/notifications";

const TeamNameView = (props: {team?: API.MatchTeam}) => {
  return (
    <Flex justify={"space-between"} align="center" w="100%">
      <Text>
        {props.team?.name ?? "Nog niet bepaald"}
      </Text>
      <Text weight="bold" size={"md"}>
        {props.team?.score ?? 0}
      </Text>
    </Flex>
  );
};

export const Bracket = ({masterNode: bracket, readonly}: {masterNode: Brackets.TreeNode, readonly?: boolean}) => {
  const {left, right, final} = useBracket(bracket);
  const theme = useMantineTheme();
  const {selectedLeague} = useContext(TeamContext);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [updatingDate, setUpdatingDate] = useState<Date|null>(null);

  const CustomSeed = ({seed, breakpoint, roundIndex, seedIndex, rounds}: IRenderSeedProps) => {
    const matchInfo = rounds?.[roundIndex].seeds[seedIndex];

    const updateMatchTeams = async (team: Team, oldTeam: Team|undefined) => {
      if (!matchInfo || loading[Number(matchInfo.id)]) return;
      if (oldTeam && team.id === oldTeam.id) return;
      if (matchInfo.teams.find(t => t.id === team.id)) return;
      setLoading(m => ({...m, [Number(matchInfo.id)]: true}));
      let newIds: number[] = matchInfo.teams.concat(team).map(t => t.id);
      if (oldTeam) {
        newIds = newIds.filter(tId => tId !== oldTeam.id);
      }
      const resp = await fetch(`/api/bracket/matches/${matchInfo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teams: newIds,
        }),
      });
      queryClient.invalidateQueries({queryKey: ["bracket", selectedLeague]});
      if (!resp.ok) {
        notifications.show({
          message:"Failed to assign team to match",
          color: "red",
        });
      }
      setLoading(m => {
        const mCopy = {...m};
        delete mCopy[Number(matchInfo.id)];
        return mCopy;
      });
    };
    
    const updateMatchDate = async () => {
      if (!updatingDate || !matchInfo) return;
      setLoading(m => ({...m, [Number(matchInfo.id)]: true}));
      const resp = await fetch(`/api/bracket/matches/${matchInfo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: updatingDate.toISOString()
        }),
      });
      queryClient.invalidateQueries({queryKey: ["bracket", selectedLeague]});
      if (!resp.ok) {
        notifications.show({
          message:"Failed to update date of match",
          color: "red",
        });
      };
      setLoading(m => {
        const mCopy = {...m};
        delete mCopy[Number(matchInfo.id)];
        return mCopy;
      });
    };

    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12, padding: theme.spacing.xs }} data-matchId={matchInfo?.id}>
        <SeedItem style={{ backgroundColor: theme.colors.vek[7] }}>
          <div>
            <SeedTeam>{readonly ? <TeamNameView team={seed.teams[0] as (API.MatchTeam | undefined)} /> : (<BracketTeamInput team={seed.teams[0] as API.MatchTeam} onTeeamSelection={updateMatchTeams} matchId={Number(matchInfo?.id)} disabled={matchInfo && loading[Number(matchInfo.id)]} />)}</SeedTeam>
            <SeedTeam>{readonly ? <TeamNameView team={seed.teams[1] as (API.MatchTeam | undefined)} /> : (<BracketTeamInput team={seed.teams[1] as API.MatchTeam} onTeeamSelection={updateMatchTeams} matchId={Number(matchInfo?.id)} disabled={matchInfo && loading[Number(matchInfo.id)]} />)}</SeedTeam>
            {!readonly && (
              <SeedTeam>
                <DateTimePicker w={"100%"} disabled={matchInfo && loading[Number(matchInfo.id)]} defaultValue={new Date(seed.date ?? Date.now())} onFocus={() => setUpdatingDate(new Date(seed.date ?? Date.now()))} submitButtonProps={{onClick: () => updateMatchDate() }} />
              </SeedTeam>
            )}
          </div>
        </SeedItem>
      </Seed>
    );
  };

  const EmptyRoundTitle = () => {
    return (
      <div />
    );
  };

  return (
    <div className="bracket-wrapper">
      <RBracket rounds={left} renderSeedComponent={CustomSeed} mobileBreakpoint={10} roundTitleComponent={EmptyRoundTitle} />
      <RBracket rounds={final} renderSeedComponent={CustomSeed} mobileBreakpoint={10} roundTitleComponent={EmptyRoundTitle} />
      <RBracket rounds={right} renderSeedComponent={CustomSeed} rtl mobileBreakpoint={10} roundTitleComponent={EmptyRoundTitle} />
    </div>
  );
};
