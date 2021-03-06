import graphDistinctSearch from "utils/graphDistinctSearch"

type Forward = Map<string, Set<string>>
type Backwards = Map<string, string>
interface Node {
  id: string
  steps: number
}

const solution1 = (forward: Forward, backwards: Backwards) => {
  const getOrbitsInTree = (root: string, depth = 0): number =>
    [...(forward.get(root) || [])]
      .map((x) => getOrbitsInTree(x, depth + 1))
      .reduce((a, b) => a + b, depth)

  let root: string = backwards.keys().next().value
  while (backwards.has(root)) root = backwards.get(root)!

  return getOrbitsInTree(root)
}

const solution2 = (forward: Forward, backwards: Backwards) =>
  graphDistinctSearch(
    { id: "YOU", steps: 0 },
    (node: Node) =>
      node.id === "SAN" ||
      [...(forward.get(node.id) || []), backwards.get(node.id) || ""]
        .filter(Boolean)
        .map((id) => ({
          id,
          steps: node.steps + 1,
        })),
    (a: Node, b: Node) => b.steps - a.steps,
  ).steps - 2

export default [solution1, solution2].map((fn) => (lines: string[]) => {
  const forward: Forward = new Map()
  const backwards: Backwards = new Map()
  lines
    .map((line) => line.split(")"))
    .forEach(([a, b]) => {
      forward.get(a)?.add(b) || forward.set(a, new Set([b]))
      backwards.set(b, a)
    })
  return fn(forward, backwards)
})
