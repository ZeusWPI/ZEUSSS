import { Button, TextInput } from "@mantine/core";
import { LeagueSelectionBox } from "../LeagueSelectionBox";

type TeamModalProps = {
  team: Team;
  updateTeam: (team: Partial<Team>) => void;
  btnLabel: string;
  btnDisabled: boolean;
  onClick: () => void;
};

export const TeamModal = ({ team, btnLabel, updateTeam, btnDisabled, onClick }: TeamModalProps) => {
  return (
    <>
      <TextInput
        label={"Team name"}
        data-autofocus
        value={team.name}
        onChange={e => updateTeam({ name: e.currentTarget.value })}
      />
      <LeagueSelectionBox value={team.league} onChange={league => updateTeam({ league })} />
      <Button onClick={onClick} mt={"md"} disabled={btnDisabled}>
        {btnLabel}
      </Button>
    </>
  );
};
