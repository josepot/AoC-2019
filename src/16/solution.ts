import binarySearch from "utils/ts/binarySearch";
import { circularLinkedList } from "utils/ts/linkedLists";
import add from "utils/ts/add";

const getLine = (str: string) => {
  const [inputsRaw, targetRaw] = str.split(" => ");
  const inputs = inputsRaw.split(", ").map(x => {
    const [rawNumber, key] = x.split(" ");
    return [key, Number(rawNumber)] as [string, number];
  });
  const [rawNumber, key] = targetRaw.split(" ");
  const target = [key, Number(rawNumber)] as [string, number];
  return [inputs, target] as [Array<[string, number]>, [string, number]];
};

const solution1 = ([line]: string) => {
  const circularList = circularLinkedList([0, 1, 0, -1]);

  const calcualteNumberForIdx = (n: number[], idx: number) => {
    let [x] = circularList;
    let counter = 1;
    const result = n
      .map(currentNumber => {
        if (counter++ % (idx + 1) === 0) {
          x = x.next;
        }
        return currentNumber * x.value;
      })
      .reduce(add);
    const res = Number(
      result
        .toString(10)
        .split("")
        .slice(-1)[0]
    );
    return res;
  };

  let numbers = line.split("").map(Number);
  for (let phase = 0; phase < 100; phase++) {
    numbers = numbers.map((_, idx, arr) => calcualteNumberForIdx(arr, idx));
  }
  return numbers.slice(0, 8).join("");
};

export default [solution1];
