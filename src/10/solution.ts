const map = new Map<string, boolean>();
let SIZE = 0;

const getAsteroidsInSight = (x: number, y: number): number => {
  const blockedAngles: [number, number][] = [];
  const detected = new Set<string>();

  for (let size = 1; size < SIZE; size++) {
    const circle: [number, number][] = [];
    for (let xDelta = 0 - size; xDelta < size + 1; xDelta++) {
      circle.push([xDelta, size]);
      circle.push([xDelta, size * -1]);
    }
    for (let yDelta = 1 - size; yDelta < size; yDelta++) {
      circle.push([size, yDelta]);
      circle.push([size * -1, yDelta]);
    }

    circle.forEach(([xAngle, yAngle]) => {
      const xTarget = x + xAngle;
      const yTarget = y + yAngle;
      const targetKey = [xTarget, yTarget].join(",");

      if (detected.has(targetKey) || !map.get(targetKey)) {
        return;
      }

      const prevAngle = blockedAngles.find(
        ([prevAngleX, prevAngleY]) =>
          prevAngleX * yAngle === xAngle * prevAngleY &&
          prevAngleX < 0 === xAngle < 0 &&
          prevAngleY < 0 === yAngle < 0
      );

      if (prevAngle) {
        /*
        console.log(
          `position ${targetKey} found by angle: ${xAngle},${yAngle} blocked by prevAngle`,
          prevAngle
        );
         */
        return;
      }

      // console.log("detected", targetKey);
      blockedAngles.push([xAngle, yAngle]);
      detected.add(targetKey);
    });
  }

  console.log(x, y, detected.size);

  return detected.size;
};

const solution1 = (lines: string[]) => {
  SIZE = lines.length;
  // console.log("SIZE", SIZE);
  const positions: [number, number][] = [];

  lines.forEach((line, y) =>
    line.split("").forEach((val, x) => {
      positions.push([x, y]);
      map.set([x, y].join(","), val === "#");
    })
  );

  return positions
    .filter(([x, y]) => map.get([x, y].join(",")))
    .map(([x, y]) => getAsteroidsInSight(x, y))
    .sort((a, b) => b - a)[0];

  //return getAsteroidsInSight(0, 3);
};

export default [solution1];
