import { TeamContext } from "@/lib/stores/teamContext";
import { Select, SelectItem } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

declare type LeagueSelectionBox =  & {
  value: string;
  onChange: (val: string) => void;
}

export const LeagueSelectionBox = ({value, onChange, filter}: Props.Selection<string>) => {
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
      label="Team League"
      data={leagueOptions}
      placeholder="Select the league"
      nothingFound="Nothing found"
      searchable
      creatable
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
