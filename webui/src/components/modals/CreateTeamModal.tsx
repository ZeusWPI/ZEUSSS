import { queryClient } from "@/lib/query";
import { Button, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { LeagueSelectionBox } from "../LeagueSelectionBox";
import { TeamModal } from "./TeamModal";

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
    <TeamModal
      team={{name, league, id: 0}}
      updateTeam={(t) => {
        if (t.name) setName(t.name);
        if (t.league) setLeague(t.league);
      }}
      btnDisabled={btnDisabled}
      btnLabel={"Create"}
      onClick={createNewTeam}
    />
  );
};
