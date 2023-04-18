import { useEffect, useState } from "react";

export const useBracket = (tree: Brackets.TreeNode[]) => {
  const [left, setLeft] = useState<Brackets.Match[][]>([]);
  const [right, setRight] = useState<Brackets.Match[][]>([]);
  const [final, setFinal] = useState<Brackets.Match[]>([]);

  const unpackNodes = (node: Brackets.TreeNode, list: Brackets.Match[][], round = 0) => {
    if (node.children) {
      node.children.forEach(child => {
        unpackNodes(child, list, round + 1);
      });
    }
    const nodeInfo = {
      date: node.date,
      id: node.id,
      league: node.league,
      teams: node.teams,
      parentId: node.parentId,
      hasChildren: !!node.children && node.children.length > 0,
    };
    if (!list[round]) {
      list[round] = [];
    }
    list[round].push(nodeInfo);
  };

  useEffect(() => {
    if (!tree) return;
    const finalNode = tree[0];
    if (finalNode.children) {
      if (finalNode.children[0]) {
        const leftBracket = finalNode.children[0];
        const leftMatches: Brackets.Match[][] = [];
        unpackNodes(leftBracket, leftMatches);
        setLeft(leftMatches.reverse());
      }
      if (finalNode.children[1]) {
        const rightBracket = finalNode.children[1];
        const rightMatches: Brackets.Match[][] = [];
        unpackNodes(rightBracket, rightMatches);
        setRight(rightMatches.reverse());
      }
    }
    setFinal(tree.map(node => ({
      date: node.date,
      id: node.id,
      league: node.league,
      teams: node.teams,
      parentId: node.parentId,
      hasChildren: !!node.children && node.children.length > 0,
    })));
  }, [tree]);

  const finalSeeds = final.map(node => [{ seeds:[node] , title: "Final" }]);
  const leftSeeds = left.map((r, i) => ({ title: `left-${i}`, seeds: r }));
  const rightSeeds = right.map((r, i) => ({ title: `right-${i}`, seeds: r }));

  return { final: finalSeeds, left: leftSeeds, right: rightSeeds };
};
