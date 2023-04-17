import { MutableRefObject, useEffect, useRef, useState } from "react";

export const useBracket = (tree: Brackets.TreeNode) => {
  const left = useRef<Brackets.Match[][]>([]);
  const right = useRef<Brackets.Match[][]>([]);
  const final = useRef<Brackets.Match[]>([]);

  const unpackNodes = (node: Brackets.TreeNode, list: MutableRefObject<Brackets.Match[][]>, round = 0) => {
    if (node.children) {
      node.children.forEach(child => {
        unpackNodes(child, list, round + 1);
      });
    };
    const nodeInfo = {
      date: node.date,
      id: node.id,
      league: node.league,
      teams: node.teams,
    };
    if (!list.current[round]) {
      list.current[round] = [];
    }
    list.current[round].push(nodeInfo);
  };

  useEffect(() => {
    final.current = [];
    left.current = [];
    right.current = [];
    const node = {
      date: tree.date,
      id: tree.id,
      league: tree.league,
      teams: tree.teams,
    };
    if (tree.children) {
      if (tree.children[0]) {
        const leftBracket = tree.children[0];
        unpackNodes(leftBracket, left);
        left.current = left.current.reverse();
      }
      if (tree.children[1]) {
        const rightBracket = tree.children[1];
        unpackNodes(rightBracket, right);
        right.current = right.current.reverse();
      }
    }
    final.current = [node];
    console.log(final, left, right);
  }, [tree]);

  return { final: [{seeds: final.current, title: ""}], left: left.current.map(r => ({title: "", seeds: r})), right: right.current.map(r => ({title: "", seeds: r})) };
};
