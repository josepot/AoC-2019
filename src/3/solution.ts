import add from "utils/ts/add";

export {};

const solution1 = (lines: string[]) => {
  const wires = lines.map(x =>
    x.split(",").map(w => ({ direction: w[0], len: Number(w.slice(1)) }))
  );
  const grid = new Map<string, Map<number, number>>();
  wires.forEach((wire, idx) => {
    let x = 0;
    let y = 0;
    let steps = 0;
    wire.forEach(({ direction, len }) => {
      if (direction === "U") {
        for (let test = 0; test < len; test++) {
          steps++;
          y += 1;
          const key = [x, y].join(",");

          if (!grid.has(key)) {
            grid.set(key, new Map([[idx, steps]]));
          } else if (!grid.get(key)!.has(idx)) {
            grid.get(key)!.set(idx, steps);
          }
        }
      } else if (direction === "D") {
        for (let test = 0; test < len; test++) {
          steps++;
          y -= 1;
          const key = [x, y].join(",");

          if (!grid.has(key)) {
            grid.set(key, new Map([[idx, steps]]));
          } else if (!grid.get(key)!.has(idx)) {
            grid.get(key)!.set(idx, steps);
          }
        }
      } else if (direction === "R") {
        for (let test = 0; test < len; test++) {
          x += 1;
          steps++;
          const key = [x, y].join(",");
          if (!grid.has(key)) {
            grid.set(key, new Map([[idx, steps]]));
          } else if (!grid.get(key)!.has(idx)) {
            grid.get(key)!.set(idx, steps);
          }
        }
      } else if (direction === "L") {
        for (let test = 0; test < len; test++) {
          x -= 1;
          steps++;
          const key = [x, y].join(",");

          if (!grid.has(key)) {
            grid.set(key, new Map([[idx, steps]]));
          } else if (!grid.get(key)!.has(idx)) {
            grid.get(key)!.set(idx, steps);
          }
        }
      }
    });
  });
  /*
  SOLUTION 1
  return [...grid.keys()]
    .map(key => ({
      distance: key
        .split(",")
        .map(Number)
        .map(x => Math.abs(x))
        .reduce(add),
      points: grid.get(key)?.size,
      key
    }))
    .filter(x => x.points === 2)
    .sort((a, b) => a.distance - b.distance)[0].distance;
   */

  return [...grid.keys()]
    .filter(key => grid.get(key)!.size === 2)
    .map(key => grid.get(key)!.get(0)! + grid.get(key)!.get(1)!)
    .sort((a, b) => a - b)[0];
};

module.exports = [solution1, solution1];
