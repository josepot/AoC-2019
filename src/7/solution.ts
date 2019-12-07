const { getPermutationsFromId: gPFID } = require("id-permutations")(5);

const nPermutations = 5 * 4 * 3 * 2;

const getPermutationsFromId: (x: number) => number[] = (x: number) => {
  const result: number[] = gPFID(x);
  return result;
};

const solution1 = ([line]: string) => {
  let maxSolution = 0;
  const program = solution(line);

  for (let i = 0; i < nPermutations; i++) {
    const permutations = getPermutationsFromId(i);
    let output = 0;
    permutations.forEach(idx => {
      output = program([idx, output]);
    });
    maxSolution = Math.max(output, maxSolution);
  }
  return maxSolution;
};

const solution2 = ([line]: string) => {
  let maxSolution = 0;

  for (let i = 0; i < nPermutations; i++) {
    const permutations = getPermutationsFromId(i);

    const programs = permutations
      .map(idx => getProgram2(line, idx + 5))
      .map(([nextInput, generator]) => [nextInput, generator()] as const);

    let ii = 0;
    let lastOutput = 0;
    do {
      let program = programs[ii % 5];
      const [nextInput, generator] = program;
      const result = generator.next().value as any;
      if (result === "input") {
        nextInput(lastOutput);
        generator.next();
        lastOutput = generator.next().value as any;
      } else if (result === "finish") {
        break;
      } else {
        throw new Error(`unnexpected state ${result}`);
      }
      ii++;
    } while (true);
    maxSolution = Math.max(lastOutput, maxSolution);
  }
  return maxSolution;
};

const getProgram2 = (line: string, idx: number) => {
  let input = idx;
  const nextInput = (x: number) => {
    input = x;
  };
  function* generator() {
    const instructions = line.split(",").map(Number);
    let currentIdx = 0;
    let output: number = -1;
    const EXIT_CODE = 99;
    let firstInput = true;

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
          if (firstInput) {
            save(input);
            firstInput = false;
          } else {
            yield "input";
            yield "input2";
            save(input);
          }
          break;
        }
        case 4: {
          [output] = getArgs(modes, 1);
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
    yield "finish";
  }
  return [nextInput, generator] as const;
};

const solution = (line: string) => (inputVals: number[]) => {
  const instructions = line.split(",").map(Number);
  let currentIdx = 0;
  let currentInputIdx = 0;
  let output: number = -1;
  const EXIT_CODE = 99;

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
        const input =
          currentInputIdx === 0
            ? inputVals[currentInputIdx++]
            : inputVals[currentInputIdx];
        save(input);
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

export default [solution1, solution2];
