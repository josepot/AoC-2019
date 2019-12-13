import intCodeGenerator, { intCodeProcessor } from "utils/ts/intCodeGenerator";
import nestData from "utils/ts/nestData";

const solution1 = ([line]: string) => {
  const visitedPositions = new Map<string, number>();

  nestData([...intCodeGenerator(line)], 3).forEach(([x, y, z]) => {
    visitedPositions.set([x, y].join(","), z as number);
  });

  return [...visitedPositions.values()].filter(x => x === 2).length;
};

const solution2 = ([line]: string) => {
  let [score, ballX, myX] = [0, 0, 0];

  intCodeProcessor(
    "2" + line.slice(1),
    (x, y, z) => {
      if (x === -1 && y === 0) {
        score = z;
      } else {
        ballX = z === 4 ? x : ballX;
        myX = z === 3 ? x : myX;
      }
    },
    () => (myX === ballX ? 0 : myX < ballX ? 1 : -1)
  );

  return score;
};

export default [solution1, solution2];
