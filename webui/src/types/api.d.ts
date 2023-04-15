declare namespace API {
  type MatchTeam = Team & {
    score?: number;
  };

  type Match = {
    id: number;
    date?: string;
    teams: MatchTeam[];
  };

  type ParsedMatch = Omit<Match, "date"> & {
    date?: Date;
  };

  type BracketMatch = Match & {
    parentId: number;
  };

  type Poule = {
    id: number;
    name: string;
    teams: MatchTeam[];
  };
}
