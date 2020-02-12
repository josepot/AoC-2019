import { intCodeProcessor } from "utils/ts/intCodeGenerator"
import printPositionsMap from "utils/ts/printPositionsMap"

const positions = new Map<string, number>()
let currentX = 0
let currentY = 0
const buildGrid = (c: number) => {
  if (c === 10) {
    currentX = 0
    currentY++
    return
  }
  positions.set(currentX + "," + currentY, c)
  currentX++
}

const aInstructions = `
NOT A J
NOT B T
OR T J
NOT C T
OR T J
AND D J
WALK
`

const bInstructions = `
NOT A J
NOT B T
OR T J
NOT C T
OR T J
AND D J
NOT E T
NOT T T
OR H T
AND T J
RUN
`

/*
WRONG!!!
previous && !((!e || !f || !g) && !h)

previous && !(!e || !f || !g) || h

previous && e && f && g || h

CORRECT!
previous && !(!e && !h)

previous && (e || e)
*/

export default [aInstructions, bInstructions].map(
  instructions => ([line]: string[]) => {
    const result = intCodeProcessor(
      line,
      buildGrid,
      parseInstructions(instructions),
    )
    if (result < 1000) {
      console.log(printPositionsMap(positions, x => String.fromCharCode(x)))
      return
    }
    return result
  },
)

const parseInstructions = (instructions: string) =>
  instructions
    .split("\n")
    .slice(1)
    .slice(0, -1)
    .join("\n")
    .split("")
    .map(x => (x === "\n" ? 10 : x.charCodeAt(0)))
    .concat(10)
