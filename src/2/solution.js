const getLineResults = line => {
  const result = {};
  line.split("").forEach(char => {
    result[char] = (result[char] || 0) + 1;
  });
  return result;
};

const getPresentSquareFeet = (x, y, z) => {
  const parts = [x * y, x * z, y * z];
  const extra = Math.min(...parts);
  return parts.map(x => x * 2).reduce((a, b) => a + b) + extra;
};

const getPresentRibon = parts => {
  const [x, y, z] = parts.sort((a, b) => a - b);
  return x + x + y + y + x * y * z;
};

const solution1 = lines =>
  lines
    .map(x => getPresentRibon(x.split("x").map(x => parseInt(x, 10))))
    .reduce((a, b) => a + b);
module.exports = [solution1];
