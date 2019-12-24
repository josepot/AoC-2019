import {
  Position,
  getAdjacentPositions,
  getPositionFromKey
} from "utils/ts/directions";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";
import add from "utils/ts/add";

const isLetter = (val: string | undefined) =>
  !!val && val.charCodeAt(0) > 64 && val.charCodeAt(0) < 91;

const getNextPosition = (current: Map<string, boolean>) => {
  return new Map<string, boolean>(
    [...current.entries()].map(([key, val]) => {
      let nextVal = val;
      if (val) {
        nextVal =
          getAdjacentPositions(getPositionFromKey(key))
            .map(x => current.get(x.key))
            .filter(Boolean).length === 1;
      } else {
        const nBugs = getAdjacentPositions(getPositionFromKey(key))
          .map(x => current.get(x.key))
          .filter(Boolean).length;
        nextVal = nBugs === 1 || nBugs === 2;
      }
      return [key, nextVal];
    })
  );
};

const solution1 = (lines: string[]) => {
  let positions = new Map<string, boolean>();
  const seenPositions = new Set<string>();
  lines.forEach((line, y) =>
    line.split("").forEach((c, x) => {
      positions.set(`${x},${y}`, c === "#");
    })
  );

  do {
    const seenKey = [...positions.values()].join("");
    if (seenPositions.has(seenKey)) {
      break;
    }
    seenPositions.add(seenKey);
    positions = getNextPosition(positions);
  } while (true);

  return [...positions.entries()]
    .map(([key, val]) => {
      if (!val) return 0;
      const pos = getPositionFromKey(key);
      const idx = pos.y * 5 + pos.x;
      return Math.pow(2, idx);
    })
    .reduce(add);
};

const solution2 = (lines: string[]) => {
  let positions = new Map<string, boolean>();
  for (let level = -100; level < 101; level++) {
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        if (x === 2 && y === 2) continue;
        positions.set(`${level},${x},${y}`, false);
      }
    }
  }

  lines.forEach((line, y) =>
    line.split("").forEach((c, x) => {
      if (x === 2 && y === 2) return;
      positions.set(`0,${x},${y}`, c === "#");
    })
  );

  const getRecurrentAdjacentPositions = (key: string) => {
    const [level, x, y] = key.split(",").map(Number);
    const result = [
      [level, x + 1, y],
      [level, x - 1, y],
      [level, x, y + 1],
      [level, x, y - 1]
    ]
      .map(([level, x, y]) => {
        if (x < 0) {
          return [level + 1, 1, 2];
        } else if (x > 4) {
          return [level + 1, 3, 2];
        } else if (y < 0) {
          return [level + 1, 2, 1];
        } else if (y > 4) {
          return [level + 1, 2, 3];
        }
        return [level, x, y];
      })
      .filter(([, x, y]) => x !== 2 || y !== 2) as [number, number, number][];

    if (x === 2 && y === 1) {
      for (let xx = 0; xx < 5; xx++) {
        result.push([level - 1, xx, 0]);
      }
    } else if (x === 2 && y === 3) {
      for (let xx = 0; xx < 5; xx++) {
        result.push([level - 1, xx, 4]);
      }
    } else if (y === 2 && x === 1) {
      for (let yy = 0; yy < 5; yy++) {
        result.push([level - 1, 0, yy]);
      }
    } else if (y === 2 && x === 3) {
      for (let yy = 0; yy < 5; yy++) {
        result.push([level - 1, 4, yy]);
      }
    }
    return result.map(x => x.join(","));
  };

  const getNextRecursivePosition = (
    key: string,
    val: boolean,
    current: Map<string, boolean>
  ) => {
    let nextVal = val;
    if (val) {
      nextVal =
        getRecurrentAdjacentPositions(key)
          .map(x => current.get(x))
          .filter(Boolean).length === 1;
    } else {
      const nBugs = getRecurrentAdjacentPositions(key)
        .map(x => current.get(x))
        .filter(Boolean).length;
      nextVal = nBugs === 1 || nBugs === 2;
    }
    return nextVal;
  };

  const getNextRecursivePositions = (positions: Map<string, boolean>) =>
    new Map<string, boolean>(
      [...positions.entries()].map(([key, val]) => [
        key,
        getNextRecursivePosition(key, val, positions)
      ])
    );

  for (let i = 0; i < 200; i++) {
    positions = getNextRecursivePositions(positions);
  }

  return [...positions.values()].map(x => (x ? 1 : 0) as number).reduce(add);
};

export default [solution1, solution2];
