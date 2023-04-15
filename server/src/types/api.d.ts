declare type StrippedTeam = {
  id: number;
  name: string;
  league: string;
};

declare type TeamWScore = StrippedTeam & {
  score: number;
};
