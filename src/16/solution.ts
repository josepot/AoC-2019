import { circularLinkedList } from "utils/ts/linkedLists"
import add from "utils/ts/add"

const solution1 = ([line]: string) => {
  const circularList = circularLinkedList([0, 1, 0, -1])

  const calcualteNumberForIdx = (n: number[], idx: number) => {
    let [x] = circularList
    let counter = 1
    return Math.abs(
      n
        .map(currentNumber => {
          if (counter++ % (idx + 1) === 0) {
            x = x.next
          }
          return currentNumber * x.value
        })
        .reduce(add) % 10,
    )
  }

  let numbers = line.split("").map(Number)
  for (let phase = 0; phase < 100; phase++) {
    numbers = numbers.map((_, idx, arr) => calcualteNumberForIdx(arr, idx))
  }
  return numbers.slice(0, 8).join("")
}

const solution2 = ([line]: string) => {
  let inputStr: string = ""
  for (let i = 0; i < 10000; i++) {
    inputStr += line
  }

  const output = inputStr
    .slice(Number(line.slice(0, 7)))
    .split("")
    .map(Number)
    .reverse()

  for (let phase = 0; phase < 100; phase++) {
    for (let i = 0, prevSum = 0; i < output.length; i++) {
      prevSum += output[i]
      output[i] = prevSum % 10
    }
  }

  return output
    .reverse()
    .slice(0, 8)
    .join("")
}

export default [solution1, solution2]
