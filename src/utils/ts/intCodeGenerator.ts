const EXIT_CODE = 99;

export type GeneratorReturnType<T> = T extends Generator<infer R, infer RR, any>
  ? R | RR
  : any;
export type GeneratorInputType<T> = T extends Generator<any, any, infer R>
  ? R
  : any;

export type GeneratorResult = GeneratorReturnType<
  ReturnType<typeof intCodeGenerator>
>;

const getOperationKeyModes = (x: number) => {
  const operationKeyRaw = x.toString(10).padStart(5, "0");
  const iKey = Number(operationKeyRaw.substring(3));
  const modes = operationKeyRaw
    .substring(0, 3)
    .split("")
    .map(Number)
    .reverse();
  return [iKey, modes] as const;
};

export default function* intCodeGenerator(line: string) {
  const instructions = line.split(",").map(Number);
  let currentIdx = 0;
  let relativeBase = 0;

  while (true) {
    const [iKey, modes] = getOperationKeyModes(instructions[currentIdx++]);
    let modeIdx = 0;

    const getReadArgs = (n: number) => {
      const args = new Array<number>(n);
      for (let i = 0; i < n; i++) {
        const mode = modes[modeIdx++];
        args[i] =
          (mode === 0
            ? instructions[instructions[currentIdx++]]
            : mode === 1
            ? instructions[currentIdx++]
            : instructions[instructions[currentIdx++] + relativeBase]) ?? 0;
      }
      return args;
    };

    const save = (val: number) => {
      const mode = modes[modeIdx++];
      const idx = instructions[currentIdx++] + (mode === 2 ? relativeBase : 0);
      instructions[idx] = val;
    };

    switch (iKey) {
      case 1: {
        const [a, b] = getReadArgs(2);
        save(a + b);
        break;
      }
      case 2: {
        const [a, b] = getReadArgs(2);
        save(a * b);
        break;
      }
      case 3: {
        const input: number | undefined = yield "input" as "input";
        if (input === undefined) {
          throw new Error("input can not be undefined");
        }
        save(input);
        break;
      }
      case 4: {
        const [output] = getReadArgs(1);
        yield output;
        break;
      }
      case 5: {
        const [a, b] = getReadArgs(2);
        if (a !== 0) {
          currentIdx = b;
        }
        break;
      }
      case 6: {
        const [a, b] = getReadArgs(2);
        if (a === 0) {
          currentIdx = b;
        }
        break;
      }
      case 7: {
        const [a, b] = getReadArgs(2);
        save(a < b ? 1 : 0);
        break;
      }
      case 8: {
        const [a, b] = getReadArgs(2);
        save(a === b ? 1 : 0);
        break;
      }
      case 9: {
        const [a] = getReadArgs(1);
        relativeBase += a;
        break;
      }
      case EXIT_CODE: {
        return;
      }
      default: {
        throw new Error(`Invalid operation with code ${iKey}`);
      }
    }
  }
}

export function intCodeProcessor(
  line: string,
  outputFn: (...args: number[]) => void,
  getInputCb?: () => number | number
) {
  const generator = intCodeGenerator(line);
  let x: GeneratorResult;
  let input: number = 0;
  const getInput: undefined | (() => number) =
    getInputCb === undefined || typeof getInputCb === "function"
      ? getInputCb
      : () => getInputCb;

  const args = new Array<number>(outputFn.length);
  let i = 0;

  while ((x = generator.next(input).value) !== undefined) {
    if (x === "input") {
      if (getInput === undefined) {
        throw new Error("Got asked for an input");
      }
      input = getInput();
    } else {
      args[i++] = x;
      if (i % args.length === 0) {
        outputFn(...args);
        i = 0;
      }
    }
  }
}
