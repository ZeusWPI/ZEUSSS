import { queryClient } from "@/lib/query";
import { Button, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { LeagueSelectionBox } from "../LeagueSelectionBox";

export const CreateModalTeam = () => {
  const [name, setName] = useState("");
  const [league, setLeague] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const createNewTeam = async () => {
    setBtnDisabled(true);
    const resp = await fetch("/api/teams", {
      method: "POST",
      body: JSON.stringify({
        name,
        league,
      })
    });
    setBtnDisabled(false);
    if (!resp.ok) {
      notifications.show({
        title: "Failed to add team",
        color: "red",
        message: `The API gave an error while adding a team: ${resp.statusText} (${resp.status})`
      });
      return;
    }
    queryClient.invalidateQueries(["teams"]);
    modals.closeAll();
  };

  return (
    <>
      <TextInput label={"Team name"} data-autofocus value={name} onChange={e => setName(e.currentTarget.value)} />
      <LeagueSelectionBox value={league} onChange={setLeague} />
      <Button onClick={createNewTeam} mt={"md"} disabled={btnDisabled}>
        Create
      </Button>
    </>
  );
};
