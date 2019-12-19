import { intCodeProcessor } from "utils/ts/intCodeGenerator";

const solution1 = async ([line]: string[]) => {
  const visitedPositions = new Map<string, number>();
  const inputs = Array(50)
    .fill(null)
    .map((_, y) =>
      Array(50)
        .fill(null)
        .map((_, x) => [x, y])
    )
    .flat();

  await Promise.all(
    inputs.map(async input => {
      let i = 0;
      const result = await intCodeProcessor(
        line,
        x => x,
        () => input[i++]
      );
      visitedPositions.set(input.join(","), result);
    })
  );

  return [...visitedPositions.values()].filter(x => x === 1).length;
};

const solution2 = async ([line]: string[]) => {
  const getValueAtPosition = (x: number, y: number) => {
    const vals = [x, y];
    let i = 0;
    return intCodeProcessor(
      line,
      x => x,
      () => vals[i++]
    );
  };
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
      continue;
    }
    const yy = await getValueAtPosition(previousX - 99, previousY + 99);
    if (yy === 0) {
      continue;
    }
    return (previousX - 99) * 10000 + previousY;
  } while (true);
};

export default [solution1, solution2];
