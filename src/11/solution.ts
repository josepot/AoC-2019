enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}

type Position = { x: number; y: number };

const directionsMap: Record<Direction, Position> = {
  [Direction.UP]: { x: 0, y: 1 },
  [Direction.DOWN]: { x: 0, y: -1 },
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.RIGHT]: { x: 1, y: 0 }
};

type NextDirection = {
  value: Direction;
  right: NextDirection;
  left: NextDirection;
};

function getTurningNextDirection() {
  const up: NextDirection = {
    value: Direction.UP,
    right: {} as NextDirection,
    left: {} as NextDirection
  };
  const down: NextDirection = {
    value: Direction.DOWN,
    right: {} as NextDirection,
    left: {} as NextDirection
  };
  const left: NextDirection = {
    value: Direction.LEFT,
    right: {} as NextDirection,
    left: {} as NextDirection
  };
  const right: NextDirection = {
    value: Direction.RIGHT,
    right: {} as NextDirection,
    left: {} as NextDirection
  };

  up.left = left;
  up.right = right;

  down.left = right;
  down.right = left;

  left.left = down;
  left.right = up;

  right.left = up;
  right.right = down;

  return up;
}

const solution1 = ([line]: string) => {
  const visitedPositions = new Map<string, boolean>();
  let currentDirection = getTurningNextDirection();
  let currentPosition = { x: 0, y: 0 };
  const generator = getIntCodeGenerator(line)(0);

  do {
    if (
      generator.next(
        visitedPositions.get([currentPosition.x, currentPosition.y].join(","))
          ? 1
          : 0
      ).done
    ) {
      break;
    }
    const color = generator.next(
      visitedPositions.get([currentPosition.x, currentPosition.y].join(","))
        ? 1
        : 0
    ).value;
    visitedPositions.set(
      [currentPosition.x, currentPosition.y].join(","),
      Boolean(color)
    );
    const nextDirection = generator.next(
      visitedPositions.get([currentPosition.x, currentPosition.y].join(","))
        ? 1
        : 0
    ).value;
    currentDirection =
      nextDirection === 0 ? currentDirection.left : currentDirection.right;
    const positionDeltas = directionsMap[currentDirection.value];
    currentPosition = {
      x: currentPosition.x + positionDeltas.x,
      y: currentPosition.y + positionDeltas.y
    };
  } while (true);
  return visitedPositions.size;
};

const solution2 = ([line]: string) => {
  const visitedPositions = new Map<string, boolean>();
  let currentDirection = getTurningNextDirection();
  let currentPosition = { x: 0, y: 0 };
  const generator = getIntCodeGenerator(line)(1);

  do {
    if (
      generator.next(
        visitedPositions.get([currentPosition.x, currentPosition.y].join(","))
          ? 1
          : 0
      ).done
    ) {
      break;
    }
    const color = generator.next(
      visitedPositions.get([currentPosition.x, currentPosition.y].join(","))
        ? 1
        : 0
    ).value;
    visitedPositions.set(
      [currentPosition.x, currentPosition.y].join(","),
      Boolean(color)
    );
    const nextDirection = generator.next(
      visitedPositions.get([currentPosition.x, currentPosition.y].join(","))
        ? 1
        : 0
    ).value;
    currentDirection =
      nextDirection === 0 ? currentDirection.left : currentDirection.right;
    const positionDeltas = directionsMap[currentDirection.value];
    currentPosition = {
      x: currentPosition.x + positionDeltas.x,
      y: currentPosition.y + positionDeltas.y
    };
  } while (true);

  const limits = [...visitedPositions.keys()]
    .map(x => x.split(",").map(Number) as [number, number])
    .reduce(
      (acc, [x, y]) => {
        return {
          left: Math.min(acc.left, x),
          right: Math.max(acc.right, x),
          top: Math.min(acc.top, y),
          bottom: Math.max(acc.bottom, y)
        };
      },
      { left: 0, right: 0, top: 0, bottom: 0 }
    );
  const width = limits.right - limits.left;
  const hight = limits.bottom - limits.top;

  return Array(hight + 1)
    .fill(null)
    .map((_, yDelta) => yDelta + limits.top)
    .map(y =>
      Array(width)
        .fill(null)
        .map((_, xDelta) => xDelta + limits.left)
        .map(x => (visitedPositions.get([x, y].join(",")) ? "#" : "."))
        .join()
    )
    .reverse()
    .join("\n");
};

export default [solution1, solution2];

const getIntCodeGenerator = (line: string) => {
  const EXIT_CODE = 99;

  return function*(initialInput: number) {
    const instructions = line.split(",").map(Number);
    let currentIdx = 0;
    let input = initialInput;
    let output: number = -1;
    let relativeBase = 0;
    let firstInput = true;

    const getArgs = (modes: number[], n: number, isWrite = false) => {
      const args = new Array<number>(n);
      for (let i = 0; i < n; i++) {
        const mode = modes[i];

        if (isWrite && i === n - 1) {
          args[i] =
            instructions[currentIdx++] + (mode === 2 ? relativeBase : 0);
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
          if (firstInput) {
            firstInput = false;
            yield "input";
          } else {
            input = yield "input";
          }
          save(input, getArgs(modes, 1, true)[0]);
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
  };
};
