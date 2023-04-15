import { useContext } from "react";
import { TeamContext } from "@/lib/stores/teamContext";
import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { Button, Group, Table, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { CreateModalTeam } from "@/components/modals/CreateTeamModal";
import { deleteAPI } from "@/lib/api";
import { UpdateTeamModal } from "@/components/modals/UpdateTeamModal";

export const TeamAdminPage = () => {
  const { teams } = useContext(TeamContext);

  const onAddBtnClick = () => {
    modals.open({
      title: "Create a new team",
      children: <CreateModalTeam />,
      color: "vek",
    });
  };

  const onEditBtnClick = (id: number) => {
    const team = teams.find(t => t.id === id);
    if (!team) return;
    modals.open({
      title: "Edit this team",
      children: <UpdateTeamModal team={team} />,
      color: "vek",
    });
  };

  const deleteTeam = (id: number) => {
    modals.openConfirmModal({
      title: "U sure you want to delete this team?",
      children: <Text>This can only be done when the team is not assigned to a poule or bracket match</Text>,
      onConfirm: () => deleteAPI(`/api/teams/${id}`, "Could not delete team"),
    });
  };

  return (
    <div>
      <Title>Teams</Title>
      <Button variant={"filled"} leftIcon={<PlusIcon size={16} />} onClick={onAddBtnClick}>
        Add
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>League</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{team.league}</td>
              <td>
                <Group align={"center"} position={"right"}>
                  <div style={{ cursor: "pointer" }}>
                    <Pencil size={16} color="black" onClick={() => onEditBtnClick(team.id)} />
                  </div>
                  <div style={{ cursor: "pointer" }}>
                    <Trash2 size={16} color="red" onClick={() => deleteTeam(team.id)} />
                  </div>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
