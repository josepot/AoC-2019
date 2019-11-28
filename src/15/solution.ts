const parseLine = (str: string) => {
  const [, key, capacity, durability, flavor, texture, calories] = str.match(
    /^(\w*):\s\w*\s(-?\d*),\s\w*\s(-?\d*),\s\w*\s(-?\d),\s\w*\s(-?\d*),\s\w*\s(-?\d*)$/
  );

  return {
    key,
    capacity: parseInt(capacity, 10),
    durability: parseInt(durability, 10),
    flavor: parseInt(flavor, 10),
    texture: parseInt(texture, 10),
    calories: parseInt(calories, 10)
  };
};
const add = (x: number, y: number) => x + y;
const solution1 = (lines: string[]) => {
  const data = lines.map(parseLine);

  let max = 0;
  for (let s = 0; s < 100; s++) {
    for (let p = 0; p < 100 - s; p++) {
      for (let f = 0; f < 100 - (s + p); f++) {
        let sr = 100 - (s + p + f);
        let total = [s, p, f, sr]
          .map((n, idx) => n * data[idx].capacity)
          .reduce(add);
        if (total < 1) continue;

        total *= [s, p, f, sr]
          .map((n, idx) => n * data[idx].durability)
          .reduce(add);
        if (total < 1) continue;

        total *= [s, p, f, sr]
          .map((n, idx) => n * data[idx].flavor)
          .reduce(add);
        if (total < 1) continue;

        total *= [s, p, f, sr]
          .map((n, idx) => n * data[idx].texture)
          .reduce(add);

        max = Math.max(total, max);
      }
    }
  }

  return max;
};

const solution2 = (lines: string[]) => {
  const data = lines.map(parseLine);

  let max = 0;
  for (let s = 0; s < 100; s++) {
    for (let p = 0; p < 100 - s; p++) {
      for (let f = 0; f < 100 - (s + p); f++) {
        let sr = 100 - (s + p + f);

        const calories = [s, p, f, sr]
          .map((n, idx) => n * data[idx].calories)
          .reduce(add);

        if (calories !== 500) continue;

        let total = [s, p, f, sr]
          .map((n, idx) => n * data[idx].capacity)
          .reduce(add);
        if (total < 1) continue;

        total *= [s, p, f, sr]
          .map((n, idx) => n * data[idx].durability)
          .reduce(add);
        if (total < 1) continue;

        total *= [s, p, f, sr]
          .map((n, idx) => n * data[idx].flavor)
          .reduce(add);
        if (total < 1) continue;

        total *= [s, p, f, sr]
          .map((n, idx) => n * data[idx].texture)
          .reduce(add);

        max = Math.max(total, max);
      }
    }
  }

  return max;
};

module.exports = [solution1, solution2];
