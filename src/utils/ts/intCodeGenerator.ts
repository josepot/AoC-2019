const EXIT_CODE = 99;

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
        save(yield "input");
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
