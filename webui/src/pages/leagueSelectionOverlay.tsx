import { LeagueSelectionBox } from "@/components/LeagueSelectionBox";
import { TeamContext } from "@/lib/stores/teamContext";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

export const LeagueSelectionOverlay = () => {
  const {selectedLeague, chooseLeague} = useContext(TeamContext);
  return (
    <>
      <div className="league-selection-overlay">
        <LeagueSelectionBox value={selectedLeague} onChange={chooseLeague} hideLabel />
      </div>
      <Outlet />
    </>
  );
};
