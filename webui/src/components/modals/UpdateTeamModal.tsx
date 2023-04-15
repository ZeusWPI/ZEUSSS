import { queryClient } from "@/lib/query";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { TeamModal } from "./TeamModal";

type UpdateTeamModalProps = {
  team: Team;
};

export const UpdateTeamModal = ({ team }: UpdateTeamModalProps) => {
  const [editedTeam, setEditedTeam] = useState<Partial<Team>>({});
  const [btnDisabled, setBtnDisabled] = useState(false);

  const updateTeam = async () => {
    if (btnDisabled) return;
    setBtnDisabled(true);

    const resp = await fetch(`/api/teams/${team.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedTeam),
    });
    const data = await resp.json();
    queryClient.invalidateQueries(["teams"]);
    if (!resp.ok) {
      notifications.show({
        message: `Failed to update team: ${data?.message ?? resp.statusText}`,
        color: "red",
      });
    }

    setBtnDisabled(false);
  };

  return (
    <TeamModal
      team={team}
      onClick={updateTeam}
      btnLabel={"Updated"}
      btnDisabled={btnDisabled}
      updateTeam={setEditedTeam}
    />
  );
};
