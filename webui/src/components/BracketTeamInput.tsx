import { queryClient } from "@/lib/query";
import { TeamContext } from "@/lib/stores/teamContext";
import { Group, NumberInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useContext, useState } from "react";
import { TeamSelectionBox } from "./TeamSelectionBox";

declare type BracketTeamInputProps = {
  team?: API.MatchTeam;
  disabled?: boolean;
  onTeeamSelection: (team: Team, oldTeam: Team | undefined) => void;
  matchId?: number;
};

export const BracketTeamInput = (props: BracketTeamInputProps) => {
  const { selectedLeague } = useContext(TeamContext);
  const [team, setTeam] = useState(props.team);
  const [score, setScore] = useState(props.team?.score ?? 0);
  const [disabled, setDisabled] = useState(false);

  const onTeamSelection = (t: Team) => {
    props.onTeeamSelection(t, team);
    setTeam(t);
  };

  const updateScore = async () => {
    if (disabled || !team || !props.matchId) return;
    setDisabled(true);
    const resp = await fetch(`/api/admin/bracket/matches/${props.matchId}/teams/${team.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
      }),
    });
    queryClient.invalidateQueries({ queryKey: ["bracket", selectedLeague] });
    if (!resp.ok) {
      notifications.show({
        message: `Failed to update team score to ${score}`,
        color: "red",
      });
    }
    setDisabled(false);
  };

  return (
    <Group spacing={"xs"}>
      <TeamSelectionBox value={team} onChange={onTeamSelection} w={"70%"} label={""} disabled={props.disabled} />
      {team && (
        <NumberInput
          min={0}
          w={"20%"}
          value={score}
          onChange={e => setScore(e === "" ? 0 : e)}
          hideControls
          disabled={props.disabled || disabled}
          onBlur={updateScore}
        />
      )}
    </Group>
  );
};
