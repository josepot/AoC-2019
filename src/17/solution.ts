import { intCodeProcessor } from "utils/intCodeGenerator"
import {
  movePosition,
  Position,
  getAdjacentPositions,
  Direction,
  getDirectionWheel,
  turnWheel,
  getPositionFromKey,
} from "utils/directions"

const PATH_CODE = "#".charCodeAt(0)
const positions = new Map<string, number>()
let currentX = 0
let currentY = 0
const buildGtrid = (c: number) => {
  if (c === 10) {
    currentX = 0
    currentY++
    return
  }
  positions.set(currentX + "," + currentY, c)
  currentX++
}

const solution1 = ([line]: string[]) => {
  intCodeProcessor(line, buildGtrid)
  return [...positions.entries()]
    .filter(([, val]) => val === PATH_CODE)
    .map(([key]) => getPositionFromKey(key))
    .filter(
      (x) =>
        getAdjacentPositions(x).filter(
          ({ key }) => positions.get(key) === PATH_CODE,
        ).length === 4,
    )
    .reduce((acc: number, { x, y }) => acc + x * y, 0)
}

const findPath = (positions: Map<string, number>) => {
  const possibleRobotVals = ["^", "v", "<", ">"].map((x) => x.charCodeAt(0))
  const [initialPositionKey, initialPositionVal] = [
    ...positions.entries(),
  ].find(([, val]) => possibleRobotVals.indexOf(val) > -1)!

  const initialDirection = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
  ][possibleRobotVals.indexOf(initialPositionVal)]

  let currentPosition: Position = getPositionFromKey(initialPositionKey)
  let wheel = getDirectionWheel()
  wheel = turnWheel(wheel, initialDirection)

  let i = 0
  let result: string[] = []
  do {
    const nextCandidates = [
      wheel.value,
      wheel.left.value,
      wheel.right.value,
    ].map((direction) => movePosition(currentPosition, direction))
    const winnerIdx = nextCandidates.findIndex(
      (x) => positions.get(x.key) === PATH_CODE,
    )
    i++

    if (winnerIdx === -1) {
      result.push(i.toString(10))
      return result.slice(1).join(",")
    }

    currentPosition = nextCandidates[winnerIdx]

    if (winnerIdx === 0) continue

    result.push(i.toString(10))
    result.push(winnerIdx === 1 ? "L" : "R")
    wheel = winnerIdx === 1 ? wheel.left : wheel.right
    i = 0
  } while (true)
}

const getNextChunks = (candidate: string, chunks: string[]): string[] =>
  chunks
    .map((chunk) =>
      chunk
        .split(candidate)
        .map((x) => (x.startsWith(",") ? x.slice(1) : x))
        .map((x) => (x.endsWith(",") ? x.slice(0, -1) : x))
        .filter(Boolean),
    )
    .flat()

const getKeySequences = (
  remainingChunks: string[],
  foundSequences: string[] = [],
): string[] => {
  if (remainingChunks.length === 0) return foundSequences

  const firstChunk = remainingChunks[0]
  if (firstChunk.length <= 20)
    return getKeySequences(getNextChunks(firstChunk, remainingChunks), [
      ...foundSequences,
      firstChunk,
    ])

  let winner: [number, string, string[]] = [Infinity, "", []]
  for (let i = 20; i > 2; i--) {
    if (firstChunk[i] !== "," || ["L", "R"].includes(firstChunk[i - 1])) {
      continue
    }
    const candidate = firstChunk.slice(0, i)
    const nextChunks = getNextChunks(candidate, remainingChunks)
    const nextChunksLen = nextChunks.reduce(
      (acc, chunk) => acc + chunk.length,
      0,
    )
    if (nextChunksLen < winner[0]) {
      winner = [nextChunksLen, candidate, nextChunks]
    }
  }
  return getKeySequences(winner[2], [...foundSequences, winner[1]])
}

const getMainSequence = (path: string, sequences: string[]) => {
  const result: number[] = []
  let left = path
  do {
    const idx = sequences.findIndex((s) => left.startsWith(s))
    result.push(idx)
    left = left.slice(sequences[idx].length + 1)
  } while (left.length > 0)
  return result.map((x) => String.fromCharCode(65 + x)).join(",")
}

const solution2 = ([line]: string[]) => {
  let solution: number[]
  const getSolution = () => {
    if (solution !== undefined) return solution

    const path = findPath(positions)
    const keySequences = getKeySequences([path])
    const mainSequence = getMainSequence(path, keySequences)

    return (solution = [mainSequence, ...keySequences, "n"]
      .map((x) =>
        x
          .split("")
          .map((x) => x.charCodeAt(0))
          .concat(10),
      )
      .flat())
  }

  let i = 0
  return intCodeProcessor(
    "2" + line.slice(1),
    buildGtrid,
    () => getSolution()[i++],
  )
}

export default [solution1, solution2]
