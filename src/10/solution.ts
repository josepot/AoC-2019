const map = new Map<string, boolean>()
let SIZE: number

const getAsteroidsInSight = (x: number, y: number) => {
  const blockedAngles: [number, number][] = []
  const detected = new Set<string>()

  for (let size = 1; size < SIZE; size++) {
    const circle: [number, number][] = []
    for (let xDelta = 0 - size; xDelta < size + 1; xDelta++) {
      circle.push([xDelta, size])
      circle.push([xDelta, size * -1])
    }
    for (let yDelta = 1 - size; yDelta < size; yDelta++) {
      circle.push([size, yDelta])
      circle.push([size * -1, yDelta])
    }

    circle.forEach(([xAngle, yAngle]) => {
      const xTarget = x + xAngle
      const yTarget = y + yAngle
      const targetKey = [xTarget, yTarget].join(",")

      if (detected.has(targetKey) || !map.get(targetKey)) {
        return
      }

      const prevAngle = blockedAngles.find(
        ([prevAngleX, prevAngleY]) =>
          prevAngleX * yAngle === xAngle * prevAngleY &&
          prevAngleX < 0 === xAngle < 0 &&
          prevAngleY < 0 === yAngle < 0,
      )

      if (prevAngle) {
        return
      }

      blockedAngles.push([xAngle, yAngle])
      detected.add(targetKey)
    })
  }
  return detected
}

const getBaseAsteroidWithAsteroidsInSight = (lines: string[]) => {
  const positions: [number, number][] = []
  SIZE = lines.length
  lines.forEach((line, y) =>
    line.split("").forEach((val, x) => {
      positions.push([x, y])
      map.set([x, y].join(","), val === "#")
    }),
  )

  return positions
    .filter(([x, y]) => map.get([x, y].join(",")))
    .map(([x, y]) => [getAsteroidsInSight(x, y), x, y] as const)
    .sort((a, b) => b[0].size - a[0].size)[0]
}

const solution1 = (asteroidsInSight: Set<string>) => asteroidsInSight.size

const solution2 = (
  asteroidsInSight: Set<string>,
  baseX: number,
  baseY: number,
) => {
  const N_WINNER = 200
  const getClockwiseAngle = ([x, y]: [number, number]): number => {
    const result = Math.atan2(x, y)
    return result < 0 ? Math.PI * 2 + result : result
  }

  let currentRound = [...asteroidsInSight.values()]
  let totalDestroyedAsteroids = currentRound.length
  while (totalDestroyedAsteroids < N_WINNER) {
    currentRound.forEach((key) => map.delete(key))
    currentRound = [...getAsteroidsInSight(baseX, baseY).values()]
    totalDestroyedAsteroids += currentRound.length
  }

  const winnerIdx =
    N_WINNER - (totalDestroyedAsteroids - currentRound.length) - 1
  const [winnerX, winnerY] = currentRound
    .map((key) => key.split(",").map(Number) as [number, number])
    .map(([x, y]) => [x - baseX, baseY - y] as [number, number])
    .sort((a, b) => getClockwiseAngle(a) - getClockwiseAngle(b))[winnerIdx]

  return (winnerX + baseX) * 100 + (baseY - winnerY)
}

export default [solution1, solution2].map((fn) => (lines: string[]) =>
  fn(...getBaseAsteroidWithAsteroidsInSight(lines)),
)
