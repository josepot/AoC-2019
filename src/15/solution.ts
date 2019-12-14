import { intCodeProcessor } from "utils/ts/intCodeGenerator";

const solution1 = async ([line]: string) => {
  const visitedPositions = new Map<string, number>();

  await intCodeProcessor(line, (x, y, z) =>
    visitedPositions.set([x, y].join(","), z)
  );

  return [...visitedPositions.values()].filter(x => x === 2).length;
};

export default [solution1];
// export default [solution1, solution2];

