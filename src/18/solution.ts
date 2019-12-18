import { circularLinkedList } from "utils/ts/linkedLists";
import add from "utils/ts/add";
import {
  Position,
  getAdjacentPositions,
  getPositionFromKey
} from "utils/ts/directions";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";

const solution1 = (lines: string[]) => {
  const positions = new Map<string, string>();
  lines.forEach((line, y) =>
    line.split("").forEach((value, x) => {
      positions.set(`${x},${y}`, value);
    })
  );

  positions.set("40,40", ".");

  const getNextKeysAtReach = (
    currentPosition: Position,
    collectedKeys: Set<string>
  ) => {
    interface SearchNode {
      id: string;
      steps: number;
    }
    const initialNode: SearchNode = {
      id: currentPosition.key,
      steps: 0
    };
    const distances = new Map<string, [number, string]>();
    try {
      graphDistinctSearch(
        initialNode,
        node => {
          const value = positions.get(node.id)!;
          if (
            value !== "." &&
            value.toLowerCase() === value &&
            !collectedKeys.has(value)
          ) {
            distances.set(value, [node.steps, node.id]);
          }
          return getAdjacentPositions(getPositionFromKey(node.id))
            .filter(p => {
              const value = positions.get(p.key);
              if (value === ".") return true;
              if (value === "#") return false;
              if (value?.toLowerCase() === value) return true;
              if (collectedKeys.has(value!.toLowerCase())) {
                return true;
              }
              return false;
            })
            .map(x => ({
              id: x.key,
              steps: node.steps + 1
            }));
        },
        (a, b) => b.steps - a.steps
      );
    } catch (e) {}
    return distances;
  };

  const getSolution = (
    currentPosition: Position,
    solution: { takenPaths: [string, number, string][]; distance: number }
  ): { takenPaths: [string, number, string][]; distance: number } => {
    console.log(
      solution.takenPaths.map(x => x[0]),
      solution.distance
    );
    const nextAvailableKeys = getNextKeysAtReach(
      currentPosition,
      new Set(solution.takenPaths.map(([key]) => key))
    );
    if (nextAvailableKeys.size === 0) return solution;

    const nextKeys = [...nextAvailableKeys.entries()]
      .sort((a, b) => a[1][0] - b[1][0])
      .filter((_, idx) => idx < 1);
    const solutions = nextKeys.map(([value, [distance, id]]) =>
      getSolution(getPositionFromKey(id), {
        takenPaths: [...solution.takenPaths, [value, distance, id]],
        distance: solution.distance + distance
      })
    );

    return solutions.sort(
      (aSolution, bSolution) => aSolution.distance - bSolution.distance
    )[0];
  };

  let currentPosition: Position = { x: 40, y: 40, key: "40,40" };
  const winner = getSolution(currentPosition, { distance: 0, takenPaths: [] });
  return winner.distance;
};

export default [solution1];
