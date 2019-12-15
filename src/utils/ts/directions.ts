export enum Direction {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4
}

export type Position = { x: number; y: number };

export const directionDeltas: Record<Direction, Position> = {
  [Direction.UP]: { x: 0, y: 1 },
  [Direction.DOWN]: { x: 0, y: -1 },
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.RIGHT]: { x: 1, y: 0 }
};

export type NextDirection = {
  value: Direction;
  right: NextDirection;
  left: NextDirection;
};

export function turnWheel(wheel: NextDirection, direction: Direction) {
  do {
    wheel = wheel.left;
  } while (wheel.value !== direction);
  return wheel;
}

export function getDirectionWheel() {
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

export const movePosition = (
  position: Position,
  direction: Direction
): Position => {
  const { x: xDelta, y: yDelta } = directionDeltas[direction];
  return {
    x: position.x + xDelta,
    y: position.y + yDelta
  };
};

export const getAdjacentPositions = (
  x: number,
  y: number
): [number, number][] => [
  [x + 1, y],
  [x - 1, y],
  [x, y + 1],
  [x, y - 1]
];
