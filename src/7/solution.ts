const { getPermutationsFromId: gPFID } = require("id-permutations")(5);

const nPermutations = 5 * 4 * 3 * 2;

const getPermutationsFromId: (x: number) => number[] = (x: number) => {
  const result: number[] = gPFID(x);
  return result;
};

const solution1 = ([line]: string) => {
  let maxSolution = 0;

  for (let i = 0; i < nPermutations; i++) {
    const permutations = getPermutationsFromId(i);
    const programs = permutations
      .map(idx => getProgram(line, idx))
      .map(([nextInput, generator]) => [nextInput, generator()] as const);

    let output = 0;
    permutations.forEach(idx => {
      let [nextInput, generator] = programs[idx];
      generator.next();
      nextInput(output);
      generator.next();
      output = generator.next().value as number;
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
      .map(idx => getProgram(line, idx + 5))
      .map(([nextInput, generator]) => [nextInput, generator()] as const);

    let ii = 0;
    let lastOutput = 0;
    do {
      let [setNnextInput, generator] = programs[ii % 5];
      const result = generator.next().value;
      if (result === "input") {
        setNnextInput(lastOutput);
        generator.next();
        lastOutput = generator.next().value as number;
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

const getProgram = (line: string, idx: number) => {
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
            firstInput = false;
          } else {
            yield "input";
            yield "input2";
          }
          save(input);
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

export default [solution1, solution2];
