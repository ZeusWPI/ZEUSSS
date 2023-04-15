declare namespace Brackets {
  type MatchNode = BracketMatch & {
    children?: MatchNode[];
  };
}
