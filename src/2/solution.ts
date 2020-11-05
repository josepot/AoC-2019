const operations: Record<number, (...args: number[]) => number> = {
  1: (a: number, b: number) => a + b,
  2: (a: number, b: number) => a * b,
}

const EXIT_CODE = 99
const solution = (a: number, b: number, instructions: number[]) => {
  instructions[1] = a
  instructions[2] = b
  let currentIdx = 0

  while (instructions[currentIdx] !== EXIT_CODE) {
    const operationKey = instructions[currentIdx++]
    const fn = operations[operationKey]
    if (fn === undefined) {
      throw new Error(`Invalid operation with code ${operationKey}`)
    }

    const args = new Array(fn.length)
    for (let i = 0; i < fn.length; i++) {
      args[i] = instructions[instructions[currentIdx++]]
    }
    instructions[instructions[currentIdx++]] = fn(...args)
  }

  return instructions[0]
}

const solution1 = (lines: string[]) =>
  solution(12, 2, lines[0].split(",").map(Number))

const solution2 = (lines: string[]) => {
  const TARGET_SOLUTION = 19690720
  const originalInstructions = lines[0].split(",").map(Number)
  for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
      const instructions = [...originalInstructions]
      if (solution(a, b, instructions) === TARGET_SOLUTION) {
        return 100 * instructions[1] + instructions[2]
      }
    }
  }
  return "Something bad happened"
}

export default [solution1, solution2]
