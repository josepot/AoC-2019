import { intCodeProcessor } from "utils/ts/intCodeGenerator";
import {
  movePosition,
  Position,
  getAdjacentPositions,
  Direction,
  getDirectionWheel,
  turnWheel,
  getPositionFromKey
} from "utils/ts/directions";
import printPositionsMap from "utils/ts/printPositionsMap";

const solution1 = async ([line]: string[]) => {
  const getValueAtPosition = (x: number, y: number) => {
    const vals = [x, y];
    let i = 0;
    return intCodeProcessor(
      line,
      x => x,
      () => vals[i++]
    );
  };

  const visitedPositions = new Map<string, number>();
  const inputs = Array(200)
    .fill(null)
    .map((_, y) =>
      Array(200)
        .fill(null)
        .map((_, x) => [x + 105 * 10, y + 70 * 10])
    )
    .flat();
  let i = 0;

  const getLastBeamAtLine = async (y: number, previousX: number) => {
    let current: number;
    let next: number;
    let i = -1;
    do {
      i++;
      current = await getValueAtPosition(previousX + i, y);
      next = await getValueAtPosition(previousX + i + 1, y);
    } while (!(current === 1 && next === 0));
    return previousX + i;
  };

  let previousX = 105 * 9;
  let previousY = 70 * 9;

  do {
    previousY++;
    previousX = await getLastBeamAtLine(previousY, previousX);
    const xx = await getValueAtPosition(previousX - 99, previousY);
    if (xx === 0) {
      console.log("not long enough", previousX, previousY);
      continue;
    }
    const yy = await getValueAtPosition(previousX - 99, previousY + 99);
    if (yy === 0) {
      console.log("not tall enough", previousX, previousY);
      continue;
    }
    return (previousX - 99) * 10000 + previousY;
  } while (true);

  /*
  await Promise.all(
    inputs.map(input => {
      let i = 0;
      return intCodeProcessor(
        line,
        x => x,
        () => input[i++]
      ).then(result => {
        visitedPositions.set(input.join(","), result);
      });
    })
  );

  const lastBeamsForLine = Array(90)
    .fill(null)
    .map((_, y) => {
      let result: Position;
      for (let x = 0; x < 120; x++) {
        const current = [x, y].join(",");
        const next = [x + 1, y].join(",");
        if (
          visitedPositions.get(next) === 0 &&
          visitedPositions.get(current) === 1
        ) {
          return getPositionFromKey(current);
        }
      }
    });

  const findWhereNFit = (n: number) => {
    for (let y = 0; y < 90; y++) {
      const last = lastBeamsForLine[y];
      if (last === undefined) {
        continue;
      }
      if (
        visitedPositions.get([last.x - n, last.y].join(",")) === 1 &&
        visitedPositions.get([last.x - n, last.y + n].join(",")) === 1
      ) {
        return [last.x - n, last.y];
      }
    }
  };
  console.log(printPositionsMap(visitedPositions, [".", "#"]));
   */
  /*

  for (let i = 2; i < 9; i++) {
    console.log(i, findWhereNFit(i));
  }
   */
};

const solution2 = async ([line]: string[]) => {
  return line;
};

export default [solution1];
