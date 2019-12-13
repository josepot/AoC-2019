import intCodeGenerator, { plugGenerator } from "utils/ts/intCodeGenerator";

const { getPermutationsFromId: gPFID } = require("id-permutations")(5);

const getPermutationsFromId: (x: number) => number[] = (x: number) => {
  const result: number[] = gPFID(x);
  return result;
};
const nPermutations = 5 * 4 * 3 * 2;

const getCombinedGenerator = (
  line: string,
  ids: number[],
  isCircular = false
) => {
  let result = ids
    .map(id => {
      const gen = intCodeGenerator(line);
      gen.next();
      gen.next(id);
      return gen;
    })
    .reduce((a, b) => plugGenerator(a, b, false));
  if (isCircular) {
    result = plugGenerator(result, result, true);
  }
  result.next();
  return result;
};

const solution1 = ([line]: string) =>
  Math.max(
    ...Array(nPermutations)
      .fill(null)
      .map((_, id) => getCombinedGenerator(line, getPermutationsFromId(id)))
      .map(gen => Math.max(gen.next(0).value as number, ...[...(gen as any)]))
  );

const solution2 = ([line]: string) =>
  Math.max(
    ...Array(nPermutations)
      .fill(null)
      .map((_, id) =>
        getCombinedGenerator(
          line,
          getPermutationsFromId(id).map(x => x + 5),
          true
        )
      )
      .map(gen => Math.max(gen.next(0).value as number, ...[...(gen as any)]))
  );

export default [solution1, solution2];
