const EXIT_CODE = 99;

export type GeneratorReturnType<T> = T extends Generator<infer R, infer RR, any>
  ? R | RR
  : any;
export type GeneratorInputType<T> = T extends Generator<any, any, infer R>
  ? R
  : any;

type IntCodeGenetator = ReturnType<typeof intCodeGenerator>;

export type GeneratorResult = GeneratorReturnType<IntCodeGenetator>;

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

// WIP
export function* plugGenerator(
  output: IntCodeGenetator,
  input: IntCodeGenetator,
  isCircular = false
) {
  let inp = yield "input";
  do {
    let out = output.next(inp).value;

    if (out === "input") {
      out = output.next(inp).value;
    }

    if (out === undefined) {
      return;
    }
    if (typeof out !== "number") {
      throw new Error("expected a number");
    }

    yield out;
    do {
      const res = output.next().value;
      if (res === undefined) {
        break;
      }
      if (res === "input") {
        break;
      }
      out = res;
      yield out;
    } while (true);

    let tout = input.next(out).value;
    if (tout === "input") {
      tout = input.next(out).value;
    }
    if (tout === undefined) {
      return;
    }
    if (typeof tout !== "number") {
      throw new Error("expected a number");
    }

    yield tout;
    do {
      const res = input.next().value;
      if (res === undefined) {
        break;
      }
      if (res === "input") {
        break;
      }
      tout = res;
      yield tout;
    } while (true);
    inp = tout;
  } while (isCircular);
}

export async function intCodeProcessor<T extends number>(
  line: string,
  outputFn: (...args: T[]) => void,
  getInputCb?: T | (() => T) | (() => Promise<T>)
) {
  const generator = intCodeGenerator(line);
  let x: GeneratorResult;
  let input: T = Infinity as T;
  const getInput: undefined | (() => Promise<T>) =
    typeof getInputCb === "function"
      ? async () => await getInputCb()
      : getInputCb === undefined
      ? undefined
      : () => Promise.resolve(getInputCb);

  const args = new Array<T>(outputFn.length);
  let i = 0;

  while ((x = generator.next(input).value) !== undefined) {
    if (x === "input") {
      if (getInput === undefined) {
        throw new Error("Got asked for an input");
      }
      input = await getInput();
    } else {
      args[i++] = x as T;
      if (i % args.length === 0) {
        outputFn(...args);
        i = 0;
      }
    }
  }

  if (!generator.next().done) {
    throw new Error("intCodeGenerator yielded undefined");
  }
  return args.slice(i - 1)[0];
}
