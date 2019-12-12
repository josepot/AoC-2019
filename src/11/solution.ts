import intCodeGenerator from "utils/ts/intCodeGenerator";
import { getDirectionWheel, movePosition, Position } from "utils/ts/directions";
import printPositionsMap from "utils/ts/printPositionsMap";

const solution1 = (visitedPositions: Map<string, 0 | 1>) =>
  visitedPositions.size;

const solution2 = (visitedPositions: Map<string, 0 | 1>) =>
  printPositionsMap(visitedPositions, x => (x ? "#" : " "))
    .split("\n")
    .reverse()
    .join("\n");

export default [solution1, solution2].map((fn, idx) => ([line]: string) => {
  const generator = intCodeGenerator(line);
  const visitedPositions = new Map<string, 0 | 1>();
  const getInput = ({ x, y }: Position): 0 | 1 =>
    visitedPositions.get([x, y].join(",")) ?? 0;

  let wheel = getDirectionWheel();
  let currentPosition = { x: 0, y: 0 };
  let input: 0 | 1 | undefined;

  while (!generator.next().done) {
    input = input === undefined ? (idx as 0 | 1) : getInput(currentPosition);
    const color = generator.next(input as number).value as 0 | 1;
    visitedPositions.set(
      [currentPosition.x, currentPosition.y].join(","),
      color
    );

    wheel = generator.next().value === 0 ? wheel.left : wheel.right;
    currentPosition = movePosition(currentPosition, wheel.value);
  }
  return fn(visitedPositions);
});
