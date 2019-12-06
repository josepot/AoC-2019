import graphDistinctSearch from "../utils/ts/graphDistinctSearch";
interface Node {
  id: string;
  steps: number;
}
type SolutionFn = (
  map: Map<string, Set<string>>,
  reverseMap: Map<string, string>
) => number;

const solution1: SolutionFn = (map, reverseMap) => {
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

const solution2: SolutionFn = (map, reverseMap) =>
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

export default [solution1, solution2].map(fn => (lines: string[]) => {
  const map = new Map<string, Set<string>>();
  const reverseMap = new Map<string, string>();
  lines
    .map(line => line.split(")"))
    .forEach(([a, b]) => {
      map.get(a)?.add(b) || map.set(a, new Set([b]));
      reverseMap.set(b, a);
    });
  return fn(map, reverseMap);
});
