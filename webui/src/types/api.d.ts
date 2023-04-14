declare namespace API {
  type BracketMatch = {
    id: number;
    parentId: number;
    date: string;
    teams: Brackets.BracketTeam[];
  }
}
