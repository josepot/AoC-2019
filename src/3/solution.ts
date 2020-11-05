import add from "utils/add"

export {}

type Direction = "U" | "D" | "L" | "R"
const directionInstructions: Record<Direction, ["x" | "y", number]> = {
  U: ["y", 1],
  D: ["y", -1],
  L: ["x", -1],
  R: ["x", 1],
}

const getWires = (lines: string[]) =>
  lines.map((x) =>
    x
      .split(",")
      .map((w) => ({ direction: w[0] as Direction, len: Number(w.slice(1)) })),
  )

const solution1 = (lines: string[]) => {
  const grid = new Map<string, Set<number>>()
  const wires = getWires(lines)

  wires.forEach((wire, idx) => {
    const currentPosition = { x: 0, y: 0 }
    wire.forEach(({ direction, len }) => {
      const [prop, delta] = directionInstructions[direction]
      for (let t = 0; t < len; t++) {
        currentPosition[prop] += delta
        const key = [currentPosition.x, currentPosition.y].join(",")

        if (!grid.has(key)) {
          grid.set(key, new Set([idx]))
        } else if (!grid.get(key)!.has(idx)) {
          grid.get(key)!.add(idx)
        }
      }
    })
  })

  return [...grid.keys()]
    .filter((key) => grid.get(key)!.size === 2)
    .map((key) =>
      key
        .split(",")
        .map(Number)
        .map((x) => Math.abs(x))
        .reduce(add),
    )
    .sort((a, b) => a - b)[0]
}

const solution2 = (lines: string[]) => {
  const grid = new Map<string, Map<number, number>>()
  const wires = getWires(lines)

  wires.forEach((wire, idx) => {
    const currentPosition = { x: 0, y: 0 }
    let steps = 0
    wire.forEach(({ direction, len }) => {
      const [prop, delta] = directionInstructions[direction]
      for (let t = 0; t < len; t++) {
        steps++
        currentPosition[prop] += delta
        const key = [currentPosition.x, currentPosition.y].join(",")

        if (!grid.has(key)) {
          grid.set(key, new Map([[idx, steps]]))
        } else if (!grid.get(key)!.has(idx)) {
          grid.get(key)!.set(idx, steps)
        }
      }
    })
  })

  return [...grid.keys()]
    .filter((key) => grid.get(key)!.size === 2)
    .map((key) => grid.get(key)!.get(0)! + grid.get(key)!.get(1)!)
    .sort((a, b) => a - b)[0]
}

export default [solution1, solution2]
