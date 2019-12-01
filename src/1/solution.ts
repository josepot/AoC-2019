import add from "utils/ts/add";

const getFuel = (x: number) => Math.floor(x / 3) - 2;
const getRecursiveFuel = (x: number): number => {
  const fuel = getFuel(x);
  return fuel < 1 ? 0 : fuel + getRecursiveFuel(fuel);
};

const solution1 = (lines: string[]) =>
  lines
    .map(Number)
    .map(getFuel)
    .reduce(add);

const solution2 = (lines: string[]) =>
  lines
    .map(Number)
    .map(getRecursiveFuel)
    .reduce(add);

export default [solution1, solution2];
