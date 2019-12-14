import binarySearch from "utils/ts/binarySearch";

interface Node {
  id: string;
  total: number;
  requires: Array<[string, number]>;
}

const getLine = (str: string) => {
  const [inputsRaw, targetRaw] = str.split(" => ");
  const inputs = inputsRaw.split(", ").map(x => {
    const [rawNumber, key] = x.split(" ");
    return [key, Number(rawNumber)] as [string, number];
  });
  const [rawNumber, key] = targetRaw.split(" ");
  const target = [key, Number(rawNumber)] as [string, number];
  return [inputs, target] as [Array<[string, number]>, [string, number]];
};

const solution1 = (nodes: Map<string, Node>, nFuel = 1) => {
  const pocket = new Map<string, number>();

  const getPrimitivePrice = (rootKey: string, amountRequested: number) => {
    if (!nodes.has(rootKey)) return amountRequested;

    const amountNeeded = amountRequested - (pocket.get(rootKey) ?? 0);
    if (amountNeeded < 0) return 0;

    const { total, requires } = nodes.get(rootKey)!;
    const multiplier = Math.ceil(amountNeeded / total);
    pocket.set(rootKey, (pocket.get(rootKey) ?? 0) + multiplier * total);

    return requires.reduce((result, [chidKey, childAmount]) => {
      const amountToRequest = multiplier * childAmount;
      result += getPrimitivePrice(chidKey, amountToRequest);
      pocket.set(chidKey, pocket.get(chidKey)! - amountToRequest);
      return result;
    }, 0);
  };

  return getPrimitivePrice("FUEL", nFuel);
};

const solution2 = (nodes: Map<string, Node>) =>
  binarySearch(x => solution1(nodes, x) - 1000000000000, 0, 10000000, false);

export default [solution1, solution2].map(fn => (lines: string[]) => {
  const nodes = new Map<string, Node>();
  lines.map(getLine).forEach(([left, [keyRight, nRight]]) => {
    nodes.set(keyRight, {
      id: keyRight,
      total: nRight,
      requires: left
    });
  });

  return fn(nodes);
});
