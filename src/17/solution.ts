export {};

const add = (a: number, b: number) => a + b;

const TARGET = 150;

const solution1 = (lines: string[]) => {
  const containers = lines.map(x => parseInt(x, 10));

  const find = (result: Array<number[]>, ...indexes: number[]) => {
    const total =
      indexes.length > 0 ? indexes.map(idx => containers[idx]).reduce(add) : 0;

    if (total > TARGET) {
      return;
    }
    if (total === TARGET) {
      result.push(indexes);
      return;
    }

    let lastIdx = indexes[indexes.length - 1];
    if (lastIdx == undefined) {
      lastIdx = -1;
    }
    for (let i = lastIdx + 1; i < containers.length; i++) {
      find(result, ...indexes, i);
    }
  };

  const res: Array<number[]> = [];
  find(res);

  const sorted = res.sort((a, b) => a.length - b.length);
  return sorted.filter(x => x.length === sorted[0].length).length;
};

// const solution2 = lines => {};

module.exports = [solution1];
