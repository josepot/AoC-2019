import { intCodeProcessor } from "utils/intCodeGenerator"
import add from "utils/add"

const solution1 = async ([line]: string[]) => {
  const inputs = Array(50)
    .fill(null)
    .map((_, y) =>
      Array(50)
        .fill(null)
        .map((_, x) => [x, y]),
    )
    .flat()

  return inputs
    .map((input) => intCodeProcessor(line, (x) => x, input))
    .reduce(add)
}

const solution2 = ([line]: string[]) => {
  const getValueAtPosition = (x: number, y: number) =>
    intCodeProcessor(line, (x) => x, [x, y])

  const getLastBeamAtLine = (y: number, previousX: number) => {
    let current: number
    let next: number
    let i = -1
    do {
      i++
      current = getValueAtPosition(previousX + i, y)
      next = getValueAtPosition(previousX + i + 1, y)
    } while (!(current === 1 && next === 0))
    return previousX + i
  }

  let previousX = 105 * 9
  let previousY = 70 * 9

  do {
    previousY++
    previousX = getLastBeamAtLine(previousY, previousX)
    if (getValueAtPosition(previousX - 99, previousY + 99) === 1) {
      return (previousX - 99) * 10000 + previousY
    }
  } while (true)
}

export default [solution1, solution2]
