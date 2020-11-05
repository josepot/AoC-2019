const checkIsValid1 = (arr: number[]) => {
  let twoAdjacent = false
  let alwaysDecrease = true

  arr.forEach((current, idx) => {
    twoAdjacent = twoAdjacent || current === arr[idx - 1]
    alwaysDecrease = alwaysDecrease && (idx === 0 || arr[idx] >= arr[idx - 1])
  })

  return alwaysDecrease && twoAdjacent
}

const checkIsValid2 = (arr: number[]) => {
  let twoAdjacent = false
  let alwaysDecrease = true

  for (let i = 0; i < arr.length; i++) {
    twoAdjacent =
      twoAdjacent ||
      (arr[i - 1] === arr[i] && arr[i] !== arr[i + 1] && arr[i] !== arr[i - 2])
    alwaysDecrease = alwaysDecrease && (i === 0 || arr[i] >= arr[i - 1])
  }

  return alwaysDecrease && twoAdjacent
}

const solution = (checkFn: (x: number[]) => boolean) => ([input]: string[]) => {
  const [FROM, TO] = input.split("-").map(Number)
  let nValid = 0
  for (let i = FROM; i < TO; i++) {
    const digits = i.toString(10).split("").map(Number)

    if (checkFn(digits)) {
      nValid++
    }
  }
  return nValid
}

export default [checkIsValid1, checkIsValid2].map(solution)
