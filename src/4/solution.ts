export {};

const FROM = 136818;
const TO = 685979;
const checkIsValid = (x: number) => {
  const arr = x
    .toString()
    .split("")
    .map(Number);

  let twoAdjacent = false;
  let alwaysDecrease = true;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i - 1] === arr[i]) {
      twoAdjacent = true;
    }
    alwaysDecrease = alwaysDecrease && (i === 0 || arr[i] >= arr[i - 1]);
  }

  return alwaysDecrease && twoAdjacent;
};

const checkIsValid2 = (x: number) => {
  const arr = x
    .toString()
    .split("")
    .map(Number);

  let alwaysDecrease = true;

  const groups = new Map<number, number[]>();

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i - 1]) {
      if (groups.has(arr[i])) {
        const currArr = groups.get(arr[i])!;

        if (arr[i] === arr[i - 2]) {
          currArr[currArr.length - 1]++;
        } else {
          currArr.push(2);
        }
      } else {
        groups.set(arr[i], [2]);
      }
    }

    alwaysDecrease = alwaysDecrease && (i === 0 || arr[i] >= arr[i - 1]);
  }

  if (!alwaysDecrease) return false;
  if (groups.size === 0) return false;

  return [...groups.values()].some(x => x.every(y => y === 2));
};

const solution1 = () => {
  let nValid = 0;
  for (let i = FROM; i < TO; i++) {
    if (checkIsValid(i)) {
      nValid++;
    }
  }
  return nValid;
};

const solution2 = () => {
  let nValid = 0;
  for (let i = FROM; i < TO; i++) {
    if (checkIsValid2(i)) {
      nValid++;
    }
  }
  return nValid;
};

module.exports = [solution1, solution2];
