export {};

let output: number = -1;

const EXIT_CODE = 99;

const solution = (inputVal: number) => (lines: string[]) => {
  const instructions = lines[0].split(",").map(Number);
  let currentIdx = 0;

  const getArgs = (modes: number[], n: number) => {
    const args = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      const mode = modes[i];

      args[i] =
        mode === 0
          ? instructions[instructions[currentIdx++]]
          : instructions[currentIdx++];
    }
    return args;
  };

  const save = (val: number) => {
    instructions[instructions[currentIdx++]] = val;
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
        const [a, b] = getArgs(modes, 2);
        save(a + b);
        break;
      }
      case 2: {
        const [a, b] = getArgs(modes, 2);
        save(a * b);
        break;
      }
      case 3: {
        save(inputVal);
        break;
      }
      case 4: {
        [output] = getArgs(modes, 1);
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
        const [a, b] = getArgs(modes, 2);
        save(a < b ? 1 : 0);
        break;
      }
      case 8: {
        const [a, b] = getArgs(modes, 2);
        save(a === b ? 1 : 0);
        break;
      }
      default: {
        throw new Error(`Invalid operation with code ${operationKey}`);
      }
    }
  }

  return output;
};

module.exports = [1, 5].map(solution);
