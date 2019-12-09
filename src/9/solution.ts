const solution1 = ([line]: string) => {
  const generator = getGeneratorFn(line, 1)();
  let output = 0;

  do {
    const res = generator.next(output);
    if (res.done) {
      break;
    }
    output = res.value as number;
  } while (true);

  return output;
};

const getGeneratorFn = (line: string, idx: number) => {
  const EXIT_CODE = 99;
  let input = idx;
  const instructions = line.split(",").map(Number);

  return function* generator() {
    let currentIdx = 0;
    let output: number = -1;
    let firstInput = true;
    let relativeBase = 0;

    const getArgs = (modes: number[], n: number, isWrite = false) => {
      const args = new Array<number>(n);
      for (let i = 0; i < n; i++) {
        const mode = modes[i];

        if (isWrite) {
          args[i] = instructions[currentIdx++ + relativeBase];
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

    const save = (val: number, modes: number[]) => {
      instructions[getArgs(modes, 1, true)[0]] = val;
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
          save(a + b, modes);
          console.log("ADD", a, b, a + b);
          break;
        }
        case 2: {
          const [a, b] = getArgs(modes, 2);
          save(a * b, modes);
          console.log("MUL", a * b);
          break;
        }
        case 3: {
          if (firstInput) {
            firstInput = false;
          } else {
            console.log("asking for input");
            input = yield "input";
          }
          console.log("in", input);
          save(input, modes);
          break;
        }
        case 4: {
          [output] = getArgs(modes, 1);
          console.log("out", output);
          yield output;
          break;
        }
        case 5: {
          const [a, b] = getArgs(modes, 2);
          if (a !== 0) {
            currentIdx = b;
          }
          console.log("JUMP FALSE", currentIdx);
          break;
        }
        case 6: {
          const [a, b] = getArgs(modes, 2);
          if (a === 0) {
            currentIdx = b;
          }
          console.log("JUMP TRUE", currentIdx);
          break;
        }
        case 7: {
          const [a, b] = getArgs(modes, 2);
          save(a < b ? 1 : 0, modes);
          console.log("LESS_THAN", a < b ? 1 : 0);
          break;
        }
        case 8: {
          const [a, b] = getArgs(modes, 2);
          save(a === b ? 1 : 0, modes);
          console.log("EQUALS", a === b ? 1 : 0);
          break;
        }
        case 9: {
          const [a] = getArgs(modes, 1);
          relativeBase += a;
          console.log("RELATIVE", relativeBase);
          break;
        }
        default: {
          throw new Error(`Invalid operation with code ${operationKey}`);
        }
      }
    }
  };
};

export default [solution1];
