const solution1 = line => {
  const mappedLines = line.split("").map(x => (x === "(" ? 1 : -1));
  let current = 0;
  for (let i = 0; i < mappedLines.length; i++) {
    current += mappedLines[i];
    if (current === -1) return i;
  }
};

const solution2 = lines => {};

module.exports = [solution1];
