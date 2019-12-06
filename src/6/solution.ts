import graphDistinctSearch from "../utils/ts/graphDistinctSearch";
interface Node {
  id: string;
  steps: number;
}
type Solution = (
  map: Map<string, Set<string>>,
  reverseMap: Map<string, string>
) => number;

const solution1: Solution = (map, reverseMap) => {
  let root: string = reverseMap.keys().next().value;
  while (reverseMap.has(root)) root = reverseMap.get(root)!;

  const getOrbits = (currentCounter: number) => (current: string): number =>
    [...(map.get(current) || [])]
      .map(getOrbits(currentCounter + 1))
      .reduce((a, b) => a + b, currentCounter);
  return getOrbits(0)(root);
};

const solution2: Solution = (map, reverseMap) =>
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
