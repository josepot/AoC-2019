import { intCodeProcessor } from "utils/ts/intCodeGenerator";
import {
  getDirectionWheel,
  movePosition,
  Position,
  getAdjacentPositions,
  Direction,
  turnWheel
} from "utils/ts/directions";
// import printPositionsMap from "utils/ts/printPositionsMap";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";

const positionToKey = (x: Position) => x.x + "," + x.y;
const getMaze = async (line: string) => {
  const visitedPositions = new Map<string, number>();
  const closedPositions = new Set<string>();
  visitedPositions.set("0,0", 1);

  let currentPosition = { x: 0, y: 0 };
  let directionWheel = getDirectionWheel();

  await intCodeProcessor<number>(
    line,
    (status: number) => {
      const nextPosition = movePosition(currentPosition, directionWheel.value);
      visitedPositions.set(positionToKey(nextPosition), status);
      if (status > 0) {
        currentPosition = nextPosition;
      }
    },
    async () => {
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
      if (yDiff === 0) {
        directionWheel = turnWheel(
          directionWheel,
          xDiff > 0 ? Direction.RIGHT : Direction.LEFT
        );
      } else {
        directionWheel = turnWheel(
          directionWheel,
          yDiff > 0 ? Direction.UP : Direction.DOWN
        );
      }

      /*
      const copy = new Map(visitedPositions);
      copy.set(currentPosition.x + "," + currentPosition.y, 3);
      console.log(
        printPositionsMap(copy, x => ["#", ".", "*", "@"][x] ?? "?")
          .split("\n")
          .reverse()
          .join("\n")
      );
      console.log("");
      await new Promise(res => setTimeout(res, 20));
         */
      return directionWheel.value;
    }
  );

  return visitedPositions;
};

const solution2 = (maze: Map<string, number>) => {
  const getNextPositions = (id: string) => {
    const [x, y] = id.split(",").map(Number);
    const result = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ]
      .map(([x, y]) => positionToKey({ x, y }))
      .map(id => {
        const value = maze.get(id)!;
        return { id, value };
      })
      .filter(x => x.value === 1);
    return result;
  };

  let minutes = 0;
  do {
    /*
    console.log("minute: ", minutes);
    console.log(printPositionsMap(maze, x => ["#", ".", "o"][x]));
    console.log("");
     */
    [...maze.entries()]
      .filter(x => x[1] === 2)
      .forEach(([id]) => {
        getNextPositions(id).forEach(p => {
          maze.set(p.id, 2);
        });
      });
    minutes++;
  } while ([...maze.values()].find(x => x === 1));
  return minutes;
};

interface Node {
  id: string;
  value: number;
  steaps: number;
}
const solution1 = (maze: Map<string, number>) =>
  graphDistinctSearch(
    { id: "0,0", steaps: 0, value: 0 } as Node,
    (node: Node) =>
      node.value === 2 ||
      getAdjacentPositions(
        ...(node.id.split(",").map(Number) as [number, number])
      )
        .map(xy => ({
          id: xy.join(","),
          value: maze.get(xy.join(","))!,
          steaps: node.steaps + 1
        }))
        .filter(x => x.value === 1 || x.value === 2),
    (a: Node, b: Node) => b.steaps - a.steaps
  ).steaps;

export default [solution1, solution2].map(fn => ([line]: string) =>
  getMaze(line).then(fn)
);
