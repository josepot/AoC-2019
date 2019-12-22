import {
  Position,
  getAdjacentPositions,
  getPositionFromKey
} from "utils/ts/directions";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";
import { doubleCircularLinkedList } from "utils/ts/linkedLists";
import bigInt, { BigInteger } from "big-integer";

const deal1 = (cards: number[]): number[] => cards.slice(0).reverse();

const deal2 = (cards: number[], n: number): number[] => {
  if (n >= 0) {
    const part1 = cards.splice(0, n);
    cards.push(...part1);
    return cards;
  } else {
    const part1 = cards.splice(n, -n);
    part1.push(...cards);
    return part1;
  }
};

const dealWithInc = (cards: number[], n: number) => {
  const result = new Array(cards.length);
  result.fill(Infinity);
  let pos = 0;
  cards.forEach(card => {
    result[pos % cards.length] = card;
    pos += n;
  });
  return result;
};

const solution1 = (lines: string[]) => {
  let cards = Array(10007)
    .fill(null)
    .map((_, idx) => idx);

  lines.forEach(line => {
    const n = Number(line.split(" ").slice(-1)[0]);
    if (line.startsWith("deal with increment ")) {
      cards = dealWithInc(cards, n);
    } else if (line.startsWith("cut")) {
      cards = deal2(cards, n);
    } else {
      cards = deal1(cards);
    }
  });

  return cards[2020];
};

const solution2 = (lines: string[]) => {
  const nCards: BigInteger = bigInt(119315717514047);
  const iterations: BigInteger = bigInt(101741582076661);

  const newStack = (increment: BigInteger, offset: BigInteger) => {
    const newIncrement = increment.multiply(-1);
    return [newIncrement, offset.add(newIncrement).mod(nCards)];
  };

  const cut = (increment: BigInteger, offset: BigInteger, n: BigInteger) =>
    [increment, offset.add(increment.multiply(n)).mod(nCards)] as const;

  const dealInc = (increment: BigInteger, offset: BigInteger, n: BigInteger) =>
    [increment.multiply(n.modInv(nCards)).mod(nCards), offset] as const;

  let offset = bigInt(0);
  let inc = bigInt(1);

  // for (let i = 0; i < 10; i++) {
  lines.forEach(line => {
    if (line.startsWith("deal with increment ")) {
      const n = bigInt(Number(line.split(" ").slice(-1)[0]));
      [inc, offset] = dealInc(inc, offset, n);
    } else if (line.startsWith("cut")) {
      const n = bigInt(Number(line.split(" ").slice(-1)[0]));
      [inc, offset] = cut(inc, offset, n);
    } else {
      [inc, offset] = newStack(inc, offset);
    }
  });
  console.log(inc.toJSNumber());
  // }

  let t = bigInt(1);
  for (let i = 0; i < 10; i++) {
    t = t.multiply(inc).mod(nCards);
    console.log(t.toJSNumber());
  }

  return offset
    .add(bigInt(2020).multiply(inc))
    .mod(nCards)
    .add(nCards)
    .toJSNumber();
};

export default [solution1, solution2];
