import {Bracket as RBracket, Seed, SeedItem, SeedTeam, IRenderSeedProps} from "react-brackets";

import "../styles/bracket.scss";
import { useBracket } from "@/lib/hooks/useBracket";

export const Bracket = ({masterNode: bracket}: {masterNode: Brackets.TreeNode}) => {
  const {left, right, final} = useBracket(bracket);

  const CustomSeed = ({seed, breakpoint, roundIndex, seedIndex}: IRenderSeedProps) => {
    // breakpoint passed to Bracket component
    // to check if mobile view is triggered or not

    // mobileBreakpoint is required to be passed down to a seed
    return (
      <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
        <SeedItem>
          <div>
            <SeedTeam style={{ color: "red" }}>{seed.teams[0]?.name || "NO TEAM "}</SeedTeam>
            <SeedTeam>{seed.teams[1]?.name || "NO TEAM "}</SeedTeam>
          </div>
        </SeedItem>
      </Seed>
    );
  };

  return (
    <div className="bracket-wrapper">
      <RBracket rounds={left} renderSeedComponent={CustomSeed} mobileBreakpoint={10} />
      <RBracket rounds={final} renderSeedComponent={CustomSeed} mobileBreakpoint={10} />
      <RBracket rounds={right} renderSeedComponent={CustomSeed} rtl mobileBreakpoint={10} />
    </div>
  );
};
