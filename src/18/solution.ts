import {
  Position,
  getAdjacentPositions,
  getPositionFromKey,
  getDiagonalPositions,
} from "utils/ts/directions"
import graphDistinctSearch from "utils/ts/graphDistinctSearch"

const solution = (positions: Map<string, string>) => {
  const initialPositions = [...positions.entries()]
    .filter(([, val]) => val === "@")
    .map(([key]) => getPositionFromKey(key))

  initialPositions.forEach(x => positions.set(x.key, "."))

  const getKeysDataFromPos = (currentPosition: Position) => {
    interface Metadata {
      id: string
      distance: number
      keysFound: string[]
      keysRequired: string[]
    }
    const result = new Map<string, Metadata>()
    try {
      graphDistinctSearch(
        {
          id: currentPosition.key,
          distance: 0,
          keysFound: [],
          keysRequired: [],
        },
        (node: Metadata) => {
          const value = positions.get(node.id)!
          let { keysFound, keysRequired } = node

          if (value !== ".") {
            const key = value.toLowerCase()
            if (key === value) {
              result.set(value, node)
              keysFound = [...keysFound, value]
            } else if (node.keysFound.indexOf(key) === -1) {
              keysRequired = [...keysRequired, key]
            }
          }
          return getAdjacentPositions(getPositionFromKey(node.id))
            .filter(p => positions.get(p.key) !== "#")
            .map(x => ({
              id: x.key,
              distance: node.distance + 1,
              keysRequired,
              keysFound,
            }))
        },
        (a, b) => b.distance - a.distance,
      )
    } catch (e) {}
    return result
  }

  const fromStart = initialPositions.map(x => getKeysDataFromPos(x))
  const keysGraph = new Map<string, ReturnType<typeof getKeysDataFromPos>>()
  fromStart.forEach((x, idx) => {
    keysGraph.set(idx.toString(10), x)
    ;[...x.keys()].forEach(key =>
      keysGraph.set(
        key,
        getKeysDataFromPos(getPositionFromKey(x.get(key)!.id)),
      ),
    )
  })

  const getNextKeysAtReach = (currentKey: string, keys: Set<string>) =>
    [...keysGraph.get(currentKey)!.entries()]
      .filter(
        ([x, { keysRequired }]) =>
          !keys.has(x) && keysRequired.every(k => keys.has(k)),
      )
      .map(([key, { distance, keysFound }]) => ({ key, distance, keysFound }))

  function getSolution(
    current: string[],
    keys: Set<string>,
    cache: Map<string, number>,
  ) {
    const cacheKey = [...current, ...[...keys].sort()].join(",")
    if (cache.has(cacheKey)) return cache.get(cacheKey)!

    const nextKeysByRobot = current.map(x => getNextKeysAtReach(x, keys))
    if (nextKeysByRobot.every(x => x.length === 0)) return 0

    const result = Math.min(
      ...nextKeysByRobot
        .map((nextKeys, robotIdx) =>
          [...nextKeys].map(
            ({ key, distance, keysFound }) =>
              distance +
              getSolution(
                current.map((x, idx) => (idx === robotIdx ? key : x)),
                new Set([...keys, key, ...keysFound]),
                cache,
              ),
          ),
        )
        .flat(),
    )
    cache.set(cacheKey, result)
    return result
  }

  return getSolution(
    fromStart.map((_, idx) => idx.toString()),
    new Set(),
    new Map(),
  )
}

const solution1 = solution

const solution2 = (positions: Map<string, string>) => {
  const [initialPosition] = [...positions.entries()]
    .filter(([, val]) => val === "@")
    .map(([key]) => getPositionFromKey(key))

  positions.set(initialPosition.key, "#")
  getAdjacentPositions(initialPosition).forEach(x => positions.set(x.key, "#"))
  getDiagonalPositions(initialPosition).forEach(x => positions.set(x.key, "@"))

  return solution(positions)
}

export default [solution1, solution2].map(fn => (lines: string[]) => {
  const positions = new Map<string, string>()
  lines.forEach((line, y) =>
    line.split("").forEach((value, x) => {
      const key = `${x},${y}`
      positions.set(key, value)
    }),
  )
  return fn(positions)
})
