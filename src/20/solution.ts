import {
  Position,
  getAdjacentPositions,
  getPositionFromKey,
  getDiagonalPositions
} from "utils/ts/directions";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";
import printPositionsMap from "utils/ts/printPositionsMap";

const solution1 = (lines: string[]) => {
  const positions = new Map<string, string>();
  const portalEntries = new Map<string, string>();
  const portalExits = new Map<string, [string, string]>();

  lines.forEach((line, y) =>
    line.split("").forEach((value, x) => {
      const key = `${x},${y}`;
      positions.set(key, value);
    })
  );
  const isLetter = (val: string | undefined) =>
    !!val && val.charCodeAt(0) > 64 && val.charCodeAt(0) < 91;

  [...positions.entries()].forEach(([posId, val]) => {
    if (isLetter(val)) {
      const [[posIdB, valB]] = getAdjacentPositions(getPositionFromKey(posId))
        .map(x => [x.key, positions.get(x.key)])
        .filter(([_, val]) => isLetter(val));

      let spacesAround = getAdjacentPositions(getPositionFromKey(posId))
        .map(x => [x.key, positions.get(x.key)])
        .filter(([_, val]) => val === ".");

      const portalId = [val, valB].sort().join("");

      const start = spacesAround.length > 0 ? posId : posIdB;
      portalEntries.set(start!, portalId);

      if (spacesAround.length === 0) {
        spacesAround = getAdjacentPositions(getPositionFromKey(posIdB!))
          .map(x => [x.key, positions.get(x.key)])
          .filter(([_, val]) => val === ".");
      }
      const exit = spacesAround[0]![0]!;
      if (portalExits.has(portalId)) {
        portalExits.get(portalId)![1] = exit;
      } else {
        portalExits.set(portalId, [exit, exit]);
      }
    }
  });

  const startPosition = getPositionFromKey("124,63");

  const visited = new Map([...positions.entries()]);

  const getAdjacentPositionsWithPortals = (key: string): string[] => {
    const currentPos = getPositionFromKey(key);
    const adjacent = getAdjacentPositions(currentPos).map(x => [
      x.key,
      positions.get(x.key)
    ]);

    const normalPositions = adjacent
      .filter(([, val]) => val === ".")
      .map(([key]) => key);

    const portalPositions: string[] = adjacent
      .filter(([, val]) => isLetter(val))
      .map(
        ([posKey]) =>
          portalExits
            .get(portalEntries.get(posKey!)!)!
            .filter(x => x !== currentPos.key)[0]
      );

    const result = [...normalPositions, ...portalPositions].filter(
      Boolean
    ) as string[];
    result.forEach(x => visited.set(x, "@"));
    return result;
  };

  const initialNode = {
    id: startPosition.key,
    steps: 0
  };

  try {
    return graphDistinctSearch(
      initialNode,
      current =>
        current.id === "69,2" ||
        getAdjacentPositionsWithPortals(current.id).map(posId => ({
          id: posId,
          steps: current.steps + 1
        })),
      (a, b) => b.steps - a.steps
    ).steps;
  } catch (e) {
    console.log("");
    console.log(printPositionsMap(visited, (x: string) => x));
  }
};

const getIsInner = (key: string): boolean => {
  const position = getPositionFromKey(key);
  const xDiff = Math.abs(position.x - 64);
  const yDiff = Math.abs(position.y - 61);
  return xDiff < 33 && yDiff < 32;
};

const solution2 = (lines: string[]) => {
  const positions = new Map<string, string>();
  const portalEntries = new Map<string, [string, boolean]>();
  const portalExits = new Map<string, [string, string]>();

  lines.forEach((line, y) =>
    line.split("").forEach((value, x) => {
      const key = `${x},${y}`;
      positions.set(key, value);
    })
  );
  const isLetter = (val: string | undefined) =>
    !!val && val.charCodeAt(0) > 64 && val.charCodeAt(0) < 91;

  [...positions.entries()].forEach(([posId, val]) => {
    if (isLetter(val)) {
      const [[posIdB, valB]] = getAdjacentPositions(getPositionFromKey(posId))
        .map(x => [x.key, positions.get(x.key)])
        .filter(([_, val]) => isLetter(val));

      let spacesAround = getAdjacentPositions(getPositionFromKey(posId))
        .map(x => [x.key, positions.get(x.key)])
        .filter(([_, val]) => val === ".");

      const portalId = [val, valB].sort().join("");

      const start = spacesAround.length > 0 ? posId : posIdB;
      portalEntries.set(start!, [portalId, getIsInner(start!)]);

      if (spacesAround.length === 0) {
        spacesAround = getAdjacentPositions(getPositionFromKey(posIdB!))
          .map(x => [x.key, positions.get(x.key)])
          .filter(([_, val]) => val === ".");
      }
      const exit = spacesAround[0]![0]!;
      if (portalExits.has(portalId)) {
        portalExits.get(portalId)![1] = exit;
      } else {
        portalExits.set(portalId, [exit, exit]);
      }
    }
  });

  const startPosition = getPositionFromKey("124,63");

  const visited = new Map([...positions.entries()]);

  let count = 0;
  const getAdjacentPositionsWithPortals = (
    key: string,
    level: number
  ): [string, number][] => {
    if (count++ % 100000 === 0) {
      console.log(printPositionsMap(visited, (x: string) => x));
    }
    const currentPos = getPositionFromKey(key);
    const adjacent = getAdjacentPositions(currentPos).map(x => [
      x.key,
      positions.get(x.key)
    ]);

    const normalPositions = adjacent
      .filter(([, val]) => val === ".")
      .map(([key]) => [key, level] as const);

    const portalPositions = adjacent
      .filter(([, val]) => isLetter(val))
      .map(([posKey]) => {
        const [portalId, isInner] = portalEntries.get(posKey!)!;
        const [exit] = portalExits
          .get(portalId)!
          .filter(x => x !== currentPos.key);
        const nextLevel = isInner ? level + 1 : level - 1;
        return [exit!, nextLevel] as const;
      })
      .filter(([, nextLevel]) => nextLevel > -1) as [string, number][];

    const result = [...normalPositions, ...portalPositions] as [
      string,
      number
    ][];
    result.forEach(([x]) => visited.set(x, "@"));
    return result;
  };

  const initialNode = {
    id: `${startPosition.key},0`,
    level: 0,
    steps: 0
  };

  try {
    return graphDistinctSearch(
      initialNode,
      current =>
        current.id === "69,2,0" ||
        getAdjacentPositionsWithPortals(current.id, current.level).map(
          ([posId, level]) => ({
            id: `${posId},${level}`,
            level,
            steps: current.steps + 1
          })
        ),
      (a, b) => b.steps - a.steps
    ).steps;
  } catch (e) {
    console.log("");
    console.log(printPositionsMap(visited, (x: string) => x));
  }
};

export default [solution1, solution2];
