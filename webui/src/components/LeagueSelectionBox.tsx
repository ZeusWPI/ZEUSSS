import { TeamContext } from "@/lib/stores/teamContext";
import { Select, SelectItem } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

declare type LeagueSelectionBox = Props.Selection<string> & {
  hideLabel?: boolean;
  readonly?: boolean;
}

export const LeagueSelectionBox = ({value, onChange, filter, hideLabel, readonly}: LeagueSelectionBox) => {
  const {leagues} = useContext(TeamContext);
  const [leagueOptions, setLeagueOptions] = useState<SelectItem[]>([]);

  useEffect(() => {
    let filteredLeagues = leagues;
    if (filter) {
      filteredLeagues = filteredLeagues.filter(l => !filter.includes(l));
    }
    setLeagueOptions(filteredLeagues.map(l => ({value: l, label: l})));
  }, [leagues]);

  return (
    <Select
      label={hideLabel ? undefined : "Team League"}
      data={leagueOptions}
      placeholder="Select the league"
      nothingFound="Nothing found"
      searchable
      creatable={!readonly}
      getCreateLabel={(query: string) => `+ Create ${query}`}
      onCreate={(query: string) => {
        const item = { value: query, label: query };
        setLeagueOptions((current) => [...current, item]);
        return item;
      }}
      value={value}
      onChange={v => onChange(v ?? "")}
    />
  );
};
