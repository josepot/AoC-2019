import { readGrid } from "../utils/readGrid";

export {};

const solution1 = (lines: string[]) => {
  let grid = readGrid(lines, x => (x === "#" ? 1 : 0) as number);

  for (let i = 0; i < 100; i++) {
    grid = grid.map((val, x, y) => {
      const on = grid.getAllNeighbours(x, y).reduce((a, b) => a + b);
      if (val === 1) {
        return on === 2 || on === 3 ? 1 : 0;
      }
      return on === 3 ? 1 : 0;
    });
  }

  return grid.data.flat().reduce((a, b) => a + b);
};

const solution2 = (lines: string[]) => {
  let grid = readGrid(lines, x => (x === "#" ? 1 : 0) as number);
  grid.data[0][0] = 1;
  grid.data[0][99] = 1;
  grid.data[99][0] = 1;
  grid.data[99][99] = 1;

  for (let i = 0; i < 100; i++) {
    grid = grid.map((val, x, y) => {
      const on = grid.getAllNeighbours(x, y).reduce((a, b) => a + b);
      if (val === 1) {
        return on === 2 || on === 3 ? 1 : 0;
      }
      return on === 3 ? 1 : 0;
    });
    grid.data[0][0] = 1;
    grid.data[0][99] = 1;
    grid.data[99][0] = 1;
    grid.data[99][99] = 1;
  }

  return grid.data.flat().reduce((a, b) => a + b);
};

module.exports = [solution1, solution2];
