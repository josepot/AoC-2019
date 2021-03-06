import { intCodeProcessor } from "utils/intCodeGenerator"
import { getDirectionWheel, movePosition, Position } from "utils/directions"
import printPositionsMap from "utils/printPositionsMap"

const solutions: ((visitedPositions: Map<string, number>) => any)[] = [
  (map) => map.size,
  (map) => printPositionsMap(map, (x) => (x ? "#" : " ")),
]

export default [0, 1].map((idx) => ([line]: string) => {
  const visitedPositions = new Map<string, number>()
  const getInput = ({ x, y }: Position): number =>
    visitedPositions.get([x, y].join(",")) ?? 0

  let wheel = getDirectionWheel()
  let currentPosition = { x: 0, y: 0, key: "0,0" }
  let initialInput = true

  intCodeProcessor(
    line,
    (color, direction) => {
      visitedPositions.set(
        [currentPosition.x, currentPosition.y].join(","),
        color,
      )
      wheel = direction === 0 ? wheel.left : wheel.right
      currentPosition = movePosition(currentPosition, wheel.value)
    },
    () => {
      if (initialInput) {
        initialInput = false
        return idx
      }
      return getInput(currentPosition)
    },
  )

  return solutions[idx](visitedPositions)
})
