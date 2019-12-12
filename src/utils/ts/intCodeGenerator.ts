const EXIT_CODE = 99;

export default function* intCodeGenerator(line: string) {
  const instructions = line.split(",").map(Number);
  let currentIdx = 0;
  let relativeBase = 0;

  const getArgs = (modes: number[], n: number, isWrite = false) => {
    const args = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      const mode = modes[i];

      if (isWrite && i === n - 1) {
        args[i] = instructions[currentIdx++] + (mode === 2 ? relativeBase : 0);
      } else {
        args[i] =
          mode === 0
            ? instructions[instructions[currentIdx++]]
            : mode === 1
            ? instructions[currentIdx++]
            : instructions[instructions[currentIdx++] + relativeBase];
      }
      args[i] = args[i] === undefined ? 0 : args[i];
    }
    return args;
  };

  const save = (val: number, idx: number) => {
    instructions[idx] = val;
  };

  while (instructions[currentIdx] !== EXIT_CODE) {
    const operationKeyRaw = instructions[currentIdx++]
      .toString(10)
      .padStart(5, "0");
    const operationKey = Number(operationKeyRaw.substring(3));
    const modes = operationKeyRaw
      .substring(0, 3)
      .split("")
      .map(Number)
      .reverse();

    switch (operationKey) {
      case 1: {
        const [a, b, c] = getArgs(modes, 3, true);
        save(a + b, c);
        break;
      }
      case 2: {
        const [a, b, c] = getArgs(modes, 3, true);
        save(a * b, c);
        break;
      }
      case 3: {
        save(yield "input", getArgs(modes, 1, true)[0]);
        break;
      }
      case 4: {
        const [output] = getArgs(modes, 1);
        yield output;
        break;
      }
      case 5: {
        const [a, b] = getArgs(modes, 2);
        if (a !== 0) {
          currentIdx = b;
        }
        break;
      }
      case 6: {
        const [a, b] = getArgs(modes, 2);
        if (a === 0) {
          currentIdx = b;
        }
        break;
      }
      case 7: {
        const [a, b, c] = getArgs(modes, 3, true);
        save(a < b ? 1 : 0, c);
        break;
      }
      case 8: {
        const [a, b, c] = getArgs(modes, 3, true);
        save(a === b ? 1 : 0, c);
        break;
      }
      case 9: {
        const [a] = getArgs(modes, 1);
        relativeBase += a;
        break;
      }
      default: {
        throw new Error(`Invalid operation with code ${operationKey}`);
      }
    }
  }
}
