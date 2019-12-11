import { getIntCodeGenerator } from "utils/ts/getIntCodeGenerator";
import { getDirectionWheel, movePosition } from "utils/ts/directions";

const solution1 = (visitedPositions: Map<string, boolean>) =>
  visitedPositions.size;

const solution2 = (visitedPositions: Map<string, boolean>) => {
  const limits = [...visitedPositions.keys()]
    .map(x => x.split(",").map(Number) as [number, number])
    .reduce(
      (acc, [x, y]) => {
        return {
          left: Math.min(acc.left, x),
          right: Math.max(acc.right, x),
          top: Math.min(acc.top, y),
          bottom: Math.max(acc.bottom, y)
        };
      },
      { left: 0, right: 0, top: 0, bottom: 0 }
    );
  const width = limits.right - limits.left + 1;
  const hight = limits.bottom - limits.top + 1;

  return Array(hight)
    .fill(null)
    .map((_, yDelta) => yDelta + limits.top)
    .map(y =>
      Array(width)
        .fill(null)
        .map((_, xDelta) => xDelta + limits.left)
        .map(x => (visitedPositions.get([x, y].join(",")) ? "#" : " "))
        .join("")
    )
    .reverse()
    .join("\n");
};

export default [solution1, solution2].map((fn, idx) => ([line]: string) => {
  const visitedPositions = new Map<string, boolean>();
  let wheel = getDirectionWheel();
  let currentPosition = { x: 0, y: 0 };
  const generator = getIntCodeGenerator(line)(idx);

  while (!generator.next().done) {
    const color = generator.next(
      visitedPositions.get([currentPosition.x, currentPosition.y].join(","))
        ? 1
        : 0
    ).value;
    visitedPositions.set(
      [currentPosition.x, currentPosition.y].join(","),
      Boolean(color)
    );

    wheel = generator.next().value === 0 ? wheel.left : wheel.right;
    currentPosition = movePosition(currentPosition, wheel.value);
  }
  return fn(visitedPositions);
});
