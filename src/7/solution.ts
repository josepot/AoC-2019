import idPermutations from "id-permutations"
const { getPermutationsFromId } = idPermutations(5)

const nPermutations = 5 * 4 * 3 * 2

const solution1 = ([line]: string) => {
  let maxSolution = 0

  for (let i = 0; i < nPermutations; i++) {
    const permutations = getPermutationsFromId(i)
    const generators = permutations
      .map((idx) => getGeneratorFn(line, idx))
      .map((generator) => generator())

    let output = 0
    permutations.forEach((idx) => {
      generators[idx].next()
      output = generators[idx].next(output).value as number
    })
    maxSolution = Math.max(output, maxSolution)
  }

  return maxSolution
}

const solution2 = ([line]: string) => {
  let maxSolution = 0

  for (let i = 0; i < nPermutations; i++) {
    const permutations = getPermutationsFromId(i)
    const generators = permutations
      .map((idx) => getGeneratorFn(line, idx + 5))
      .map((generator) => generator())

    let lastOutput = 0
    let ii = 0
    do {
      const generator = generators[ii++ % 5]
      if (generator.next().done) {
        break
      }
      lastOutput = generator.next(lastOutput).value as number
    } while (true)
    maxSolution = Math.max(lastOutput, maxSolution)
  }
  return maxSolution
}

const getGeneratorFn = (line: string, idx: number) => {
  const EXIT_CODE = 99
  let input = idx
  const instructions = line.split(",").map(Number)

  return function* generator() {
    let currentIdx = 0
    let output: number = -1
    let firstInput = true

    const getArgs = (modes: number[], n: number) => {
      const args = new Array<number>(n)
      for (let i = 0; i < n; i++) {
        const mode = modes[i]

        args[i] =
          mode === 0
            ? instructions[instructions[currentIdx++]]
            : instructions[currentIdx++]
      }
      return args
    }

    const save = (val: number) => {
      instructions[instructions[currentIdx++]] = val
    }

    while (instructions[currentIdx] !== EXIT_CODE) {
      const operationKeyRaw = instructions[currentIdx++]
        .toString(10)
        .padStart(5, "0")
      const operationKey = Number(operationKeyRaw.substring(3))
      const modes = operationKeyRaw
        .substring(0, 3)
        .split("")
        .map(Number)
        .reverse()

      switch (operationKey) {
        case 1: {
          const [a, b] = getArgs(modes, 2)
          save(a + b)
          break
        }
        case 2: {
          const [a, b] = getArgs(modes, 2)
          save(a * b)
          break
        }
        case 3: {
          if (firstInput) {
            firstInput = false
          } else {
            input = yield "input"
          }
          save(input)
          break
        }
        case 4: {
          ;[output] = getArgs(modes, 1)
          yield output
          break
        }
        case 5: {
          const [a, b] = getArgs(modes, 2)
          if (a !== 0) {
            currentIdx = b
          }
          break
        }
        case 6: {
          const [a, b] = getArgs(modes, 2)
          if (a === 0) {
            currentIdx = b
          }
          break
        }
        case 7: {
          const [a, b] = getArgs(modes, 2)
          save(a < b ? 1 : 0)
          break
        }
        case 8: {
          const [a, b] = getArgs(modes, 2)
          save(a === b ? 1 : 0)
          break
        }
        default: {
          throw new Error(`Invalid operation with code ${operationKey}`)
        }
      }
    }
  }
}

export default [solution1, solution2]
