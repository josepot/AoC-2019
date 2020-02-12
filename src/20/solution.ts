import {
  Position,
  getAdjacentPositions,
  getPositionFromKey,
} from "utils/ts/directions"
import graphDistinctSearch from "utils/ts/graphDistinctSearch"

const getIsInner = (key: string): boolean => {
  const position = getPositionFromKey(key)
  return (
    position.y > 34 && position.y < 89 && position.x > 34 && position.x < 92
  )
}

const isLetter = (val: string | undefined) =>
  !!val && val.charCodeAt(0) > 64 && val.charCodeAt(0) < 91

const solution1 = (
  positions: Map<string, string>,
  portalEntries: Map<string, [string, boolean]>,
  portalExits: Map<string, Set<string>>,
  startPosition: Position,
  endPositionKey: string,
) => {
  const getAdjacentPositionsWithPortals = (currentPos: Position): string[] => {
    const adjacent = getAdjacentPositions(currentPos).map(x => [
      x.key,
      positions.get(x.key)!,
    ])

    const normalPositions = adjacent
      .filter(([, val]) => val === ".")
      .map(([key]) => key)

    const portalPositions = adjacent
      .filter(([, val]) => isLetter(val))
      .map(([posKey]) => portalEntries.get(posKey)!)
      .filter(([portalId]) => portalId !== "AA" && portalId !== "ZZ")
      .map(([portalId]) => {
        const [exit] = [...portalExits.get(portalId)!].filter(
          x => x !== currentPos.key,
        )
        return exit
      })

    return [...normalPositions, ...portalPositions]
  }

  const initialNode = {
    id: startPosition.key,
    position: startPosition,
    steps: 0,
  }

  return graphDistinctSearch(
    initialNode,
    current =>
      current.id === endPositionKey ||
      getAdjacentPositionsWithPortals(current.position).map(id => ({
        id,
        position: getPositionFromKey(id),
        steps: current.steps + 1,
      })),
    (a, b) => b.steps - a.steps,
  ).steps
}

const solution2 = (
  positions: Map<string, string>,
  portalEntries: Map<string, [string, boolean]>,
  portalExits: Map<string, Set<string>>,
  startPosition: Position,
  endPositionKey: string,
) => {
  const getAdjacentPositionsWithPortals = (
    currentPos: Position,
    level: number,
  ): [string, number][] => {
    const adjacent = getAdjacentPositions(currentPos).map(x => [
      x.key,
      positions.get(x.key)!,
    ])

    const normalPositions = adjacent
      .filter(([, val]) => val === ".")
      .map(([key]) => [key, level] as const)

    const portalPositions = adjacent
      .filter(([, val]) => isLetter(val))
      .map(([posKey]) => portalEntries.get(posKey)!)
      .filter(([portalId]) => portalId !== "AA" && portalId !== "ZZ")
      .map(([portalId, isInner]) => {
        const exit = [...portalExits.get(portalId)!].filter(
          x => x !== currentPos.key,
        )[0]!
        const nextLevel = level + (isInner ? 1 : -1)

        return [exit, nextLevel] as const
      })
      .filter(([, nextLevel]) => nextLevel > -1) as [string, number][]

    return [...normalPositions, ...portalPositions] as [string, number][]
  }

  const initialNode = {
    id: `${startPosition.key},0`,
    position: startPosition,
    level: 0,
    steps: 0,
  }

  return graphDistinctSearch(
    initialNode,
    current =>
      current.id === `${endPositionKey},0` ||
      getAdjacentPositionsWithPortals(current.position, current.level).map(
        ([posId, level]) => ({
          id: `${posId},${level}`,
          position: getPositionFromKey(posId),
          level,
          steps: current.steps + 1,
        }),
      ),
    (a, b) => b.steps - a.steps,
  ).steps
}

export default [solution1, solution2].map(fn => (lines: string[]) => {
  const positions = new Map<string, string>()
  const portalEntries = new Map<string, [string, boolean]>()
  const portalExits = new Map<string, Set<string>>()

  lines.forEach((line, y) =>
    line.split("").forEach((value, x) => {
      const key = `${x},${y}`
      positions.set(key, value)
    }),
  )
  ;[...positions.entries()].forEach(([posId, val]) => {
    if (isLetter(val)) {
      const [[posIdB, valB]] = getAdjacentPositions(getPositionFromKey(posId))
        .map(x => [x.key, positions.get(x.key)])
        .filter(([_, val]) => isLetter(val))

      let spacesAround = getAdjacentPositions(getPositionFromKey(posId))
        .map(x => [x.key, positions.get(x.key)])
        .filter(([_, val]) => val === ".")

      const portalId = [val, valB].sort().join("")
      const start = spacesAround.length > 0 ? posId : posIdB
      portalEntries.set(start!, [portalId, getIsInner(start!)])

      if (spacesAround.length === 0) {
        spacesAround = getAdjacentPositions(getPositionFromKey(posIdB!))
          .map(x => [x.key, positions.get(x.key)])
          .filter(([_, val]) => val === ".")
      }
      const exit = spacesAround[0]![0]!
      if (!portalExits.has(portalId)) {
        portalExits.set(portalId, new Set())
      }
      portalExits.get(portalId)!.add(exit)
    }
  })

  const startPosition = getPositionFromKey([...portalExits.get("AA")!][0])
  const [endPositionKey] = [...portalExits.get("ZZ")!]
  return fn(
    positions,
    portalEntries,
    portalExits,
    startPosition,
    endPositionKey,
  )
})
