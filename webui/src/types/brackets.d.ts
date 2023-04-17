declare namespace Brackets {
  type Bracket = Round[]
  type Round = Match[];
  type Match = {
    id: number;
    league: string;
    teams: Team[];
    date?: string;
  }

  type TreeNode = Match & {
    parentId: number | null,
    teams: [],
    children?: TreeNode[];
  }
}
