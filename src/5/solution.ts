export {};

let output: number = -1;

const EXIT_CODE = 99;
const solution = (inputVal: number) => (lines: string[]) => {
  const instructions = lines[0].split(",").map(Number);
  let currentIdx = 0;
  const operations: Record<
    number,
    (...args: number[]) => number | void | { jump: number }
  > = {
    1: (a: number, b: number) => a + b,
    2: (a: number, b: number) => a * b,
    3: (a: number) => {
      instructions[a] = inputVal;
    },
    4: (a: number) => {
      output = a;
    },
    5: (a: number, b: number) => {
      if (a !== 0) return { jump: b };
    },
    6: (a: number, b: number) => {
      if (a === 0) return { jump: b };
    },
    7: (a: number, b: number) => (a < b ? 1 : 0),
    8: (a: number, b: number) => (a === b ? 1 : 0)
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

    const fn = operations[operationKey];
    if (fn === undefined) {
      throw new Error(`Invalid operation with code ${operationKey}`);
    }

    const args = new Array(fn.length);
    for (let i = 0; i < fn.length; i++) {
      const mode = modes[i];

      args[i] =
        operationKey !== 3 && mode === 0
          ? instructions[instructions[currentIdx++]]
          : instructions[currentIdx++];
    }

    const result = fn(...args);
    if (typeof result === "number") {
      instructions[instructions[currentIdx++]] = result;
    } else if (result) {
      currentIdx = result.jump;
    }
  }

  return output;
};

module.exports = [1, 5].map(solution);
