import intCodeGenerator, {
  intCodeProcessor,
  GeneratorResult
} from "utils/ts/intCodeGenerator";
import printPositionsMap from "utils/ts/printPositionsMap";

const positions = new Map<string, number>();
let currentX = 0;
let currentY = 0;
const buildGrid = (c: number) => {
  if (c === 10) {
    currentX = 0;
    currentY++;
    return;
  }
  positions.set(currentX + "," + currentY, c);
  currentX++;
};

const solution1 = ([line]: string[]) => {
  const inputs = Array(50)
    .fill(null)
    .map(() => [] as number[]);
  const indexes = Array(50)
    .fill(null)
    .map(() => 0);

  const generators = Array(50)
    .fill(null)
    .map(() => intCodeGenerator(line));
  const generatorLatestResults: IteratorResult<number | "input", void>[] = [];
  generators.forEach((g, idx) => {
    g.next();
    generatorLatestResults[idx] = g.next(idx);
  });

  let result: number | undefined;

  while (result === undefined) {
    generators.forEach((g, idx) => {
      let res = generatorLatestResults[idx];
      if (res.done) return;
      while (res.value === "input" && indexes[idx] < inputs[idx].length) {
        res = g.next(inputs[idx][indexes[idx]++]);
      }
      if (res.value === "input") {
        res = g.next(-1);
        generatorLatestResults[idx] = res;
        return;
      }

      if (res.done) return;

      const address = res.value as number;
      const x = g.next().value as number;
      const y = g.next().value as number;
      if (address === 255) {
        return (result = y);
      }
      inputs[address].push(x, y);
      generatorLatestResults[idx] = g.next();
    });
  }

  return result;

  /*
  const computers = Array(50)
    .fill(null)
    .map((_, idx) =>
      intCodeProcessor(
        line,
        (a, x, y) => {
          inputs[a].push(x);
          inputs[a].push(y);
          console.log(a, x, y, idx);
          if (a === 255) {
            console.log(y);
          }
        },
        () => {
          const input = inputs[idx];
          const result =
            indexes[idx] >= input.length ? -1 : input[indexes[idx]++];
          if (result !== -1) {
            console.log(indexes);
            console.log(inputs);
            console.log("input requested", idx, result);
          }
          return result;
        }
      )
    );
  */
};

export default [solution1];

/*
const aInstructions = `
NOT A J
NOT B T
OR T J
NOT C T
OR T J
AND D J
WALK
`;

const bInstructions = `
NOT A J
NOT B T
OR T J
NOT C T
OR T J
AND D J
NOT E T
NOT T T
OR H T
AND T J
RUN
`;

export default [aInstructions, bInstructions].map(
  instructions => ([line]: string[]) => {
    const result = intCodeProcessor(
      line,
      buildGrid,
      parseInstructions(instructions)
    );
    if (result < 1000) {
      console.log(printPositionsMap(positions, x => String.fromCharCode(x)));
      return;
    }
    return result;
  }
);

const parseInstructions = (instructions: string) =>
  instructions
    .split("\n")
    .slice(1)
    .slice(0, -1)
    .join("\n")
    .split("")
    .map(x => (x === "\n" ? 10 : x.charCodeAt(0)))
    .concat(10);
 */
