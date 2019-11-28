const players = [
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Eric",
  "Frank",
  "George",
  "Mallory",
  "Myself"
];
const { getPermutationsFromId } = require("id-permutations")(players.length);

const factorial = x => (x === 1 ? 1 : x * factorial(x - 1));
const relations = new Map();

const getHappiness = (aIdx, bIdx) =>
  relations.get(players[aIdx]).get(players[bIdx]);

const solution1 = lines => {
  players.forEach(player => relations.set(player, new Map([["Myself", 0]])));

  lines.forEach(line => {
    const [, main, winLoss, pointsStr, target] = line.match(
      /^(\w*)\s\w*\s(\w*)\s(\d*)\s.*\s(\w*).$/
    );
    relations
      .get(main)
      .set(target, parseInt(pointsStr, 10) * (winLoss === "gain" ? 1 : -1));
  });

  for (let i = 0; i < 8; i++) {
    relations.get("Myself").set(players[i], 0);
  }

  const nPermutations = factorial(players.length);

  let maxTotal = 0;
  for (let i = 0; i < nPermutations; i++) {
    const order = getPermutationsFromId(i);
    let total =
      getHappiness(order[0], order[8]) +
      getHappiness(order[0], order[1]) +
      getHappiness(order[8], order[0]) +
      getHappiness(order[8], order[7]);
    for (let i = 1; i < 8; i++) {
      total +=
        getHappiness(order[i], order[i - 1]) +
        getHappiness(order[i], order[i + 1]);
    }

    maxTotal = Math.max(maxTotal, total);
  }

  return maxTotal;
};

const solution2 = lines => {};

module.exports = [solution1];
