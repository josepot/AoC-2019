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
  WALL = 0,
  OPEN = 1,
  AIR = 2
}

const drawValues = ["#", ".", "o"];

interface Node {
  id: string;
  value: Cell;
}

const solution1 = ([line]: string[]) => {};

const solution2 = ([line]: string[]) => {};

export default [solution1, solution2];

/*
export default [solution1, solution2].map(fn => ([line]: string) =>
  getMaze(line).then(fn)
);
 */
