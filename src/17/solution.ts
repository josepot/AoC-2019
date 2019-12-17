import { intCodeProcessor } from "utils/ts/intCodeGenerator";
import {
  movePosition,
  Position,
  getAdjacentPositions,
  Direction
} from "utils/ts/directions";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";
import printPositionsMap from "utils/ts/printPositionsMap";

enum Cell {
  WALL = 35,
  OPEN = 46,
  AIR = 2
}

const drawValues = ["#", ".", "o"];

interface Node {
  id: string;
  value: Cell;
}

const solution1 = async ([line]: string[]) => {
  const positions = new Map<string, number>();
  let currentX = 0;
  let currentY = 0;
  const outFn = (c: number) => {
    if (c === 10) {
      currentX = 0;
      currentY++;
      return;
    }
    positions.set(currentX + "," + currentY, c);
    currentX++;
  };
  await intCodeProcessor(line, outFn);
  console.log(printPositionsMap(positions, x => String.fromCharCode(x)));
  return [...positions.entries()].reduce((acc: number, [key, val]) => {
    const [x, y] = key.split(",").map(Number);
    if (
      val === 35 &&
      getAdjacentPositions(x, y).filter(pos => {
        const res = positions.get([pos[0], pos[1]].join(","));
        return res === 35;
      }).length === 4
    ) {
      return (
        acc +
        key
          .split(",")
          .map(Number)
          .reduce((a, b) => a * b)
      );
    }
    return acc;
  }, 0);
};

const solution2 = async ([line]: string[]) => {
  const A = ["R 6", "L 10", "R 10", "R 10"]
    .map(x => x.split(" ").join(","))
    .join(",");
  const B = ["L 10", "L 12", "R 10"].map(x => x.split(" ").join(",")).join(",");
  const C = ["R 6", "L 12", "L 10"].map(x => x.split(" ").join(",")).join(",");
  const mainRoutine = ["A", "B", "A", "B", "A", "C", "A", "C", "B", "C"];

  const positions = new Map<string, number>();
  let currentX = 0;
  let currentY = 0;
  const outFn = (c: number) => {
    return c;
  };
  let i = 0;
  const solution = [
    ...mainRoutine
      .join(",")
      .split("")
      .map(x => x.charCodeAt(0))
      .concat(10),
    ...A.split("")
      .map(x => x.charCodeAt(0))
      .concat(10),
    ...B.split("")
      .map(x => x.charCodeAt(0))
      .concat(10),
    ...C.split("")
      .map(x => x.charCodeAt(0))
      .concat([10, 110, 10])
  ];

  return await intCodeProcessor("2" + line.slice(1), outFn, () => {
    /*
    console.log(printPositionsMap(positions, x => String.fromCharCode(x)));
    return new Promise(res => setTimeout(res, 10000000));
     */
    return solution[i++];
  });

  /*
  const manualSolution = [
    "R 6", "L 10", "R 10", "R 10",
    "L 10", "L 12", "R 10",
    "R 6", "L 10", "R 10", "R 10",
    "L 10", "L 12", "R 10",

    "R 6", "L 10", "R 10", "R 10",
    "R 6", "L 12", "L 10",
    "R 6", "L 10", "R 10", "R 10",
    "R 6", "L 12", "L 10",

    "L 10", "L 12", "R 10",
    "R 6",  "L 12", "L 10"
  ]
    .map(x => x.split(" ").join(","))
    .join(",");
  */
};

export default [solution1, solution2];

/*
export default [solution1, solution2].map(fn => ([line]: string) =>
  getMaze(line).then(fn)
);
 */
