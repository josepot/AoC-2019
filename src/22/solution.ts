import {
  Position,
  getAdjacentPositions,
  getPositionFromKey,
} from "utils/ts/directions"
import graphDistinctSearch from "utils/ts/graphDistinctSearch"
import { doubleCircularLinkedList } from "utils/ts/linkedLists"
import bigInt, { BigInteger } from "big-integer"

const deal1 = (cards: number[]): number[] => cards.slice(0).reverse()

const deal2 = (cards: number[], n: number): number[] => {
  if (n >= 0) {
    const part1 = cards.splice(0, n)
    cards.push(...part1)
    return cards
  } else {
    const part1 = cards.splice(n, -n)
    part1.push(...cards)
    return part1
  }
}

const dealWithInc = (cards: number[], n: number) => {
  const result = new Array(cards.length)
  result.fill(Infinity)
  let pos = 0
  cards.forEach(card => {
    result[pos % cards.length] = card
    pos += n
  })
  return result
}

const solution1 = (lines: string[]) => {
  let cards = Array(10007)
    .fill(null)
    .map((_, idx) => idx)

  lines.forEach(line => {
    const n = Number(line.split(" ").slice(-1)[0])
    if (line.startsWith("deal with increment ")) {
      cards = dealWithInc(cards, n)
    } else if (line.startsWith("cut")) {
      cards = deal2(cards, n)
    } else {
      cards = deal1(cards)
    }
  })

  return cards.indexOf(2019)
}

const solution2 = (lines: string[]) => {
  const nCards: BigInteger = bigInt(119315717514047)
  // const nCards: BigInteger = bigInt(10007);
  const iterations: BigInteger = bigInt(101741582076661)
  /*
  initialFirstCardVal = 0
  initialInc = 1;

  getRelativeCardValue(idx, firstCardVal, increment) = (firstCardVal + (increment * idx)) % nCards
  getCardValue(idx, firstCardVal, increment) = (getRelativeCardValue(idx, firstCardVal, increment) + nCards) % nCards
   */

  /*
  newStack:
    nextIncrement = -currentIncrement
    nextFirstCardVal = currentFirstCardVal - currentIncrement;

  Example:
    - inc = 7
    - firstCardVal = 4
      => 4 1 8 5 2 9 6 3 0 7
    newStack()
    - nextIncrement = -7
    - nextFirstCardVal = -3
      => -3 0 -7 -4 -1 -8 -5 -2 -9 -6
  */
  const newStack = (increment: BigInteger, firstCardValue: BigInteger) => [
    increment.multiply(-1),
    firstCardValue.minus(increment).mod(nCards),
  ]

  /*
  cut(n):
    nextIncrement = currentIncrement
    nextFirstCardVal = (currentFirstCardVal + (currentIncrement * n)) % nCards

  Example:
    - inc = 7
    - firstCardVal = 8
      => 8 5 2 9 6 3 0 7 4 1
    cut(3)
    - nextIncrement = 7
    - nextFirstCardVal = 29 % 10 = 9
      => 9 6 3 0 7 4 1 8 5 2
    cut(-4)
    - nextIncrement = 7
    - nextFirstCardVal = -9
      => -9 -2 5 2 9 6 3 0 7 4
   */
  const cut = (
    increment: BigInteger,
    firstCardValue: BigInteger,
    n: BigInteger,
  ) =>
    [increment, firstCardValue.add(increment.multiply(n)).mod(nCards)] as const

  /*
  dealInc(n):
  - nextFirstCardVal = currentFirstCArdVal
  - nextIncrement = secondCardVal - firstCardVal
      (currentIdx * n) % nCards = nextIdx
        (currentIdxWhichWillBecomeIdx1 * n) % nCards = 1
        currentIdxWhichWillBecomeIdx1 = modInv(n , nCards)
      secondCardVal = getRelativeCardValue(modInv(n , nCards), currentFirstCardVal, currentIncrement)
    nextIncrement = getRelativeCardValue(modInv(n , nCards), currentFirstCardVal, currentIncrement) - currentFirstCardVal
    nextIncrement = currentFirstCardVal + (currentIncrement * modInv(n , nCards))) % nCards - currentFirstCardVal
  **************************************************************************
  ** - nextIncrement = (currentIncrement * modInv(n , nCards))) % nCards ***
  **************************************************************************

  Example:
    - firstCardVal = 8
    - inc = 7
      => 8 5 2 9 6 3 0 7 4 1
    dealInc(3)
    - nextFirstCardVal = 8
    - nextIncrement = (7 * 7) % 10 = 9
      => 8 7 6 5 4 3 2 1 0 9
    dealInc(9)
    - nextFirstCardVal = 8
    - nextIncrement = (9 * 9) % 10 = 1
      => 8 9 0 1 2 3 4 5 6 7
  */
  const dealInc = (
    increment: BigInteger,
    firstCardValue: BigInteger,
    n: BigInteger,
  ) =>
    [increment.multiply(n.modInv(nCards)).mod(nCards), firstCardValue] as const

  let firstCardValue = bigInt(0)
  let inc = bigInt(1)

  // for (let i = 0; i < 20; i++) {
  lines.forEach(line => {
    if (line.startsWith("deal with increment ")) {
      const n = bigInt(Number(line.split(" ").slice(-1)[0]))
      ;[inc, firstCardValue] = dealInc(inc, firstCardValue, n)
    } else if (line.startsWith("cut")) {
      const n = bigInt(Number(line.split(" ").slice(-1)[0]))
      ;[inc, firstCardValue] = cut(inc, firstCardValue, n)
    } else {
      ;[inc, firstCardValue] = newStack(inc, firstCardValue)
    }
  })
  // console.log(inc.toJSNumber(), firstCardValue.toJSNumber());
  // }
  // return;
  /*
  let iii = bigInt(inc);
  let fff = bigInt(firstCardValue);

  for (let i = 0; i < 20; i++) {
    console.log(iii.toJSNumber(), fff.toJSNumber());
    fff = fff.add(iii.multiply(firstCardValue)).mod(nCards);
    iii = iii.multiply(inc).mod(nCards);
  }
   */

  const finalInc = inc.modPow(iterations, nCards)
  const finalFirstCard = firstCardValue
    .multiply(
      bigInt(1)
        .minus(inc)
        .mod(nCards)
        .modInv(nCards),
    )
    .multiply(bigInt(1).minus(finalInc))

  return finalFirstCard
    .add(bigInt(2020).multiply(finalInc))
    .mod(nCards)
    .add(nCards)
    .mod(nCards)
    .toJSNumber()
}

export default [solution1, solution2]
