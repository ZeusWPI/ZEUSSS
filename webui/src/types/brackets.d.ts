declare namespace Brackets {
  type Bracket = Round[];
  type Round = Match[];
  type Match = {
    id: number;
    league: string;
    teams: Team[];
    date?: string;
    parentId: number | null;
    hasChildren: boolean;
  };

  type TreeNode = Match & {
    parentId: number | null;
    teams: API.MatchTeam[];
    children?: TreeNode[];
  };
}
