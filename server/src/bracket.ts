export const createBracketTree = (matches: Brackets.MatchNode[]): Brackets.MatchNode[] => {
  const tree: Brackets.MatchNode[] = [];
  const childOf: Record<number, Brackets.MatchNode[]> = {};
  matches.forEach(item => {
    const { id, parentId } = item;
    childOf[id] = childOf[id] || [];
    item.children = childOf[id];
    parentId ? (childOf[parentId] = childOf[parentId] || []).push(item) : tree.push(item);
  });
  return tree;
};
