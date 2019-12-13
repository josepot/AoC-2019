import intCodeGenerator, { GeneratorResult } from "utils/ts/intCodeGenerator";

const solution1 = ([line]: string) => {
  const visitedPositions = new Map<string, number>();
  const generator = intCodeGenerator(line);
  let x: GeneratorResult;

  while ((x = generator.next().value) !== "done") {
    const y = generator.next().value;
    visitedPositions.set([x, y].join(","), generator.next().value as number);
  }

  return [...visitedPositions.values()].filter(x => x === 2).length;
};

const solution2 = ([line]: string) => {
  const generator = intCodeGenerator("2" + line.slice(1));
  let ballX = 0;
  let myX = 0;
  let score = 0;
  let x: GeneratorResult;

  while ((x = generator.next().value) !== "done") {
    if (x === "input") {
      const input = myX === ballX ? 0 : myX < ballX ? 1 : -1;
      x = generator.next(input).value as number;
    }
    const y = generator.next().value as number;
    const z = generator.next().value as number;

    if (x === -1 && y === 0) {
      score = z;
    } else {
      ballX = z === 4 ? x : ballX;
      myX = z === 3 ? x : myX;
    }
  }

  return score;
};

export default [solution1, solution2];
