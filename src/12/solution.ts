import add from "utils/ts/add"

type Moon = [[number, number, number], [number, number, number]]

const compare = (a: number, b: number) => (b > a ? 1 : b < a ? -1 : 0)

const getNextVelocity = (moons: Moon[], moon: Moon): Moon => {
  const otherMoons = moons.filter(x => x !== moon)

  return otherMoons.reduce(
    ([[posX, posY, posZ], [velX, velY, velZ]], [[x, y, z]]) => [
      [posX, posY, posZ],
      [
        velX + compare(posX, x),
        velY + compare(posY, y),
        velZ + compare(posZ, z),
      ],
    ],
    moon,
  )
}

const getNextPositions = (moons: Moon[]): Moon[] =>
  moons.map(([[x, y, z], [velX, velY, velZ]]) => [
    [x + velX, y + velY, z + velZ],
    [velX, velY, velZ],
  ])

const fromLineToMoon = (line: string): Moon => {
  const [, x, y, z] = line
    .match(/<x=(-?\d*), y=(-?\d*), z=(-?\d*)>/)!
    .map(Number)
  return [
    [x, y, z],
    [0, 0, 0],
  ]
}

const solution1 = (lines: string[]) => {
  let moons = lines.map(fromLineToMoon)

  for (let time = 0; time < 1000; time++) {
    moons = moons.map(moon => getNextVelocity(moons, moon))
    moons = getNextPositions(moons)
  }

  return moons
    .map(([a, b]) => a.map(Math.abs).reduce(add) * b.map(Math.abs).reduce(add))
    .reduce(add)
}

const getMoonAxisKey = (moon: Moon, axis: number) =>
  [moon[0][axis], moon[1][axis]].join(",")
const getMoonsAxisKey = (moons: Moon[], axis: number) =>
  moons.map(moon => getMoonAxisKey(moon, axis)).join(".")

const findAxisPeriod = (lines: string[], axis: number) => {
  let moons = lines.map(fromLineToMoon)
  const history = new Set<string>()
  let key = getMoonsAxisKey(moons, axis)
  let count = 0

  do {
    history.add(key)
    moons = moons.map(moon => getNextVelocity(moons, moon))
    moons = getNextPositions(moons)
    key = getMoonsAxisKey(moons, axis)
    count++
  } while (!history.has(key))
  return count
}

const largestDivisor = (a_: number, b_: number) => {
  let [a, b] = [a_, b_]
  while (b > 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}
const minimumCommonMultiple = (a: number, b: number) =>
  (a * b) / largestDivisor(a, b)

const solution2 = (lines: string[]) =>
  [0, 1, 2].map(idx => findAxisPeriod(lines, idx)).reduce(minimumCommonMultiple)

export default [solution1, solution2]
