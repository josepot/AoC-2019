const getSueData = (line: string) => {
  const [, nSue, prop1, nProp1, prop2, nProp2, prop3, nProp3] = line.match(
    /^Sue\s(\d*):\s(\w*):\s(\d*),\s(\w*):\s(\d*),\s(\w*):\s(\d*)$/
  );
  return {
    key: parseInt(nSue, 10),
    props: {
      [prop1]: parseInt(nProp1, 10),
      [prop2]: parseInt(nProp2, 10),
      [prop3]: parseInt(nProp3, 10)
    }
  };
};

const target: { [key: string]: number } = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
};

const sol1 = (lines: string[]) =>
  lines
    .map(getSueData)
    .find(x =>
      Object.entries(x.props).every(([prop, value]) => target[prop] === value)
    )?.key;

const sol2 = (lines: string[]) =>
  lines.map(getSueData).find(x =>
    Object.entries(x.props).every(([prop, value]) => {
      if (prop === "cats" || prop === "trees") {
        return value > target[prop];
      }

      if (prop === "pomeranians" || prop === "goldfish") {
        return value < target[prop];
      }

      return value === target[prop];
    })
  )?.key;

module.exports = [sol1, sol2];
