import graphSearch from "../utils/ts/graphSearch";

export {};

const solution1 = (lines: string[]) => {
  const map = new Map<string, Set<string>>();
  const reverseMap = new Map<string, string>();
  const orbits = new Map<string, number>();

  lines
    .map(line => line.split(")"))
    .forEach(([a, b]) => {
      if (!map.has(a)) {
        map.set(a, new Set([b]));
      } else {
        map.get(a)!.add(b);
      }
      if (reverseMap.has(b)) {
        throw new Error("not expected");
      } else {
        reverseMap.set(b, a);
      }
    });

  const leafs = [...reverseMap.keys()].filter(x => !map.has(x));

  const getOrbits = (key: string): number => {
    const prev = reverseMap.get(key);
    if (!prev) {
      orbits.set(key, 0);
      return 0;
    }
    if (orbits.has(key)) return orbits.get(key)!;
    const result = getOrbits(prev) + 1;
    orbits.set(key, result);
    return result;
  };

  leafs.forEach(x => getOrbits(x));

  return [...orbits.values()].reduce((a, b) => a + b);
};

interface Node {
  id: string;
  steps: number;
}

const comparator = (a: Node, b: Node) => b.steps - a.steps;

const solution2 = (lines: string[]) => {
  const map = new Map<string, Set<string>>();
  const reverseMap = new Map<string, string>();

  const analizedNodes = new Map<string, Node>();

  lines
    .map(line => line.split(")"))
    .forEach(([a, b]) => {
      if (!map.has(a)) {
        map.set(a, new Set([b]));
      } else {
        map.get(a)!.add(b);
      }
      if (reverseMap.has(b)) {
        throw new Error("not expected");
      } else {
        reverseMap.set(b, a);
      }
    });

  const initialNode: Node = { id: "YOU", steps: 0 };
  analizedNodes.set("YOU", initialNode);

  const analizer = (node: Node): Node[] | true => {
    if (node.id === "SAN") return true;

    const result: string[] = [...(map.get(node.id) || [])];
    if (reverseMap.has(node.id)) {
      result.push(reverseMap.get(node.id)!);
    }
    const steps = node.steps + 1;

    return result
      .filter(x => !analizedNodes.has(x))
      .map(id => {
        const res = {
          id,
          steps
        };
        analizedNodes.set(id, res);
        return res;
      });
  };

  return graphSearch(initialNode, analizer, comparator).steps - 2;
};

module.exports = [solution1, solution2];
