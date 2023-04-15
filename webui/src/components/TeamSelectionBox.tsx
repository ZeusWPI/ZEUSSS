import { TeamContext } from "@/lib/stores/teamContext";
import { Select, SelectItem } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

export const TeamSelectionBox = ({ value, onChange, filter }: Props.Selection<Team>) => {
  const { teams } = useContext(TeamContext);
  const [teamOptions, setTeamOptions] = useState<SelectItem[]>([]);

  useEffect(() => {
    let teamCopy = [...teams];
    if (filter) {
      teamCopy = teamCopy.filter(t => !filter.find(t2 => t2.id === t.id));
    }
    setTeamOptions(teamCopy.map(t => ({ value: String(t.id), label: t.name })));
  }, [teams, filter]);

  return (
    <Select
      label="Select a team"
      data={teamOptions}
      placeholder="Select a team"
      nothingFound="Nothing found"
      searchable
      value={String(value?.id ?? "")}
      onChange={v => {
        onChange(teams.find(t => t.id === Number(v))!);
      }}
    />
  );
};
