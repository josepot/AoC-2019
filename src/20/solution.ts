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
            .get(
              portalEntries
                .get(posKey!)!
                .split("")
                .sort()
                .join("")
            )!
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

const solution2 = (lines: string[]) => {};

export default [solution1];
// export default [solution1, solution2];
