import { intCodeProcessor } from "utils/ts/intCodeGenerator";
import {
  movePosition,
  Position,
  getAdjacentPositions,
  Direction
} from "utils/ts/directions";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";

enum Cell {
  WALL = 0,
  OPEN = 1,
  AIR = 2
}

const positionToKey = (x: Position) => x.x + "," + x.y;

const getMaze = async (line: string) => {
  const visitedPositions = new Map<string, Cell>();
  const closedPositions = new Set<string>();
  visitedPositions.set("0,0", 1);

  let currentPosition = { x: 0, y: 0 };
  let currentDirection: Direction;

  const processOutput = (status: Cell) => {
    const nextPosition = movePosition(currentPosition, currentDirection);
    visitedPositions.set(positionToKey(nextPosition), status);
    if (status > 0) {
      currentPosition = nextPosition;
    }
  };

  const getNextDirection = () => {
    const unVisitedPositions = getAdjacentPositions(
      currentPosition.x,
      currentPosition.y
    ).filter(([x, y]) => !visitedPositions.has([x, y].join(",")));

    let nextTarget;
    if (unVisitedPositions.length === 0) {
      closedPositions.add(positionToKey(currentPosition));
      const openPositions = getAdjacentPositions(
        currentPosition.x,
        currentPosition.y
      ).filter(([x, y]) => {
        const key = [x, y].join(",");
        return visitedPositions.get(key)! > 0 && !closedPositions.has(key);
      });
      if (openPositions.length === 0) return Infinity;
      [nextTarget] = openPositions;
    } else {
      [nextTarget] = unVisitedPositions;
    }

    const xDiff = nextTarget[0] - currentPosition.x;
    const yDiff = nextTarget[1] - currentPosition.y;
    return (currentDirection =
      yDiff === 0
        ? xDiff > 0
          ? Direction.RIGHT
          : Direction.LEFT
        : yDiff > 0
        ? Direction.UP
        : Direction.DOWN);
  };

  await intCodeProcessor<number>(line, processOutput, getNextDirection);
  return visitedPositions;
};

interface Node {
  id: string;
  value: Cell;
  steps: number;
}

const solution1 = (maze: Map<string, Cell>) =>
  graphDistinctSearch(
    { id: "0,0", steps: 0, value: 0 } as Node,
    (node: Node) =>
      node.value === Cell.AIR ||
      getAdjacentPositions(
        ...(node.id.split(",").map(Number) as [number, number])
      )
        .map(xy => ({
          id: xy.join(","),
          value: maze.get(xy.join(","))!,
          steps: node.steps + 1
        }))
        .filter(x => x.value !== Cell.WALL),
    (a: Node, b: Node) => b.steps - a.steps
  ).steps;

const solution2 = (maze: Map<string, Cell>) => {
  const getNextPositions = (id: string) =>
    getAdjacentPositions(...(id.split(",").map(Number) as [number, number]))
      .map(([x, y]) => positionToKey({ x, y }))
      .map(id => ({ id, value: maze.get(id)! }))
      .filter(x => x.value === Cell.OPEN);

  let minutes = 0;
  do {
    [...maze.entries()]
      .filter(([, value]) => value === Cell.AIR)
      .forEach(([id]) => {
        getNextPositions(id).forEach(p => maze.set(p.id, Cell.AIR));
      });
    minutes++;
  } while ([...maze.values()].find(x => x === 1));
  return minutes;
};

export default [solution1, solution2].map(fn => ([line]: string) =>
  getMaze(line).then(fn)
);
