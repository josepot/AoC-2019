import graphDistinctSearch from "../utils/ts/graphDistinctSearch";
export {};

const getMaps = (lines: string[]) => {
  const map = new Map<string, Set<string>>();
  const reverseMap = new Map<string, string>();
  lines
    .map(line => line.split(")"))
    .forEach(([a, b]) => {
      map.get(a)?.add(b) || map.set(a, new Set([b]));
      reverseMap.set(b, a);
    });
  return [map, reverseMap] as const;
};

const solution1 = (
  map: Map<string, Set<string>>,
  reverseMap: Map<string, string>
) => {
  const orbits = new Map<string, number>();
  const getOrbits = (key: string): number => {
    if (orbits.has(key)) return orbits.get(key)!;

    const prev = reverseMap.get(key);
    const result = prev ? getOrbits(prev) + 1 : 0;
    orbits.set(key, result);
    return result;
  };
  [...reverseMap.keys()].filter(x => !map.has(x)).forEach(x => getOrbits(x));
  return [...orbits.values()].reduce((a, b) => a + b);
};

interface Node {
  id: string;
  steps: number;
}

const solution2 = (
  map: Map<string, Set<string>>,
  reverseMap: Map<string, string>
) =>
  graphDistinctSearch(
    { id: "YOU", steps: 0 },
    (node: Node) =>
      node.id === "SAN" ||
      [...(map.get(node.id) || []), reverseMap.get(node.id) || ""]
        .filter(Boolean)
        .map(id => ({
          id,
          steps: node.steps + 1
        })),
    (a: Node, b: Node) => b.steps - a.steps
  ).steps - 2;

module.exports = [solution1, solution2].map(fn => (lines: string[]) =>
  fn(...getMaps(lines))
);
