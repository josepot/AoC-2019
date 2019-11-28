const solution1 = line => {
  const solution = {
    "0-0": 1
  };
  let x = 0;
  let y = 0;
  let xx = 0;
  let yy = 0;

  const directionsS = {
    "^": () => [x, ++y],
    v: () => [x, --y],
    "<": () => [--x, y],
    ">": () => [++x, y]
  };

  const directionsR = {
    "^": () => [xx, ++yy],
    v: () => [xx, --yy],
    "<": () => [--xx, yy],
    ">": () => [++xx, yy]
  };

  line.split("").forEach((direction, idx) => {
    const fn = idx % 2 ? directionsS : directionsR;
    const [x, y] = fn[direction]();
    const key = y + "-" + x;
    solution[key] = (solution[key] || 0) + 1;
  });
  return Object.keys(solution).length;
};

const solution2 = lines => {};

module.exports = [solution1];
