import { fetchMatchLocations } from "@/lib/api";
import { Center, Loader, Select, SelectItem, SelectProps, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const LocationSelectBox = ({value, onChange, ...props}: Omit<SelectProps, "value"|"onChange"|"data"> & Props.Selection<string>) => {
  const {isError,isLoading, data} = useQuery<string[], Error>({
    queryKey: ["locations"],
    queryFn: () => fetchMatchLocations()
  });
  const [extraLocations,setExtraLocations] = useState<SelectItem[]>([]);
  const options = useMemo(() => [...extraLocations, ...(data ?? []).map(l => ({ label: l, value: l }))], [data, extraLocations]);

  if (isLoading) {
    return (
      <Center>
        <Loader size={"sm"} color="vek" />
        <Text>Loading locations</Text>
      </Center>
    );
  }
  if (isError) {
    return (
      <Center>
        <Text>Failed to load locations</Text>
      </Center>
    );
  }
  return (
    <Select
      {...props}
      data={options}
      placeholder="Location"
      value={value}
      searchable
      creatable
      getCreateLabel={(query: string) => `+ Create ${query}`}
      onCreate={(query: string) => {
        const item = { value: query, label: query };
        setExtraLocations(current => [...current, item]);
        return item;
      }}
      onChange={v => onChange(v ?? "")}
    />
  );
};
