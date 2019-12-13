import intCodeGenerator from "utils/ts/intCodeGenerator";
import { getDirectionWheel, movePosition, Position } from "utils/ts/directions";
import printPositionsMap from "utils/ts/printPositionsMap";
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const askQuestion = (x: any) => new Promise(res => rl.question(x, res));

const solution1 = ([line]: string) => {
  const generator = intCodeGenerator(line);
  const visitedPositions = new Map<string, number>();

  do {
    const x = generator.next().value;
    const y = generator.next().value;
    const { value, done } = generator.next();
    visitedPositions.set([x, y].join(","), value as number);
    if (done) break;
  } while (true);

  return [...visitedPositions.values()].filter(x => x === 2).length;
};

  let ballX = 0;
  let myX = 0;
const solution2 = ([line]: string) => {
  const generator = intCodeGenerator('2' + line.slice(1));
  const visitedPositions = new Map<string, number>();

  let score = 0;
  do {
    let x = generator.next().value;
    if (x === "input") {
      console.log(
      printPositionsMap(visitedPositions, xx =>
        xx === 0 ? " " :
        xx === 1 ? "#" :
        xx === 2 ? "$" :
        xx === 3 ? "-" :
        xx === 4 ? "o" : "X"
      )
        .split("\n")
        .join("\n")
      );

      const input = myX === ballX ? 0 : myX < ballX ? 1 : -1;
      // await askQuestion(`$myX: ${myX}, ballX: ${ballX}, input: ${input}`);
      x = generator.next(input as number).value;
    }
    const y = generator.next().value;
    if (y === "input") {
      console.log('y input');
      break;
    }
    const { value, done } = generator.next();
    if(value === 'input') {
      console.log('value input')
      break;
    }
    if (x === -1 && y ===0) {
      score = value as number
    } else {
      if (value === 4) {
        ballX = x as number;
      }
      if (value === 3) {
        myX = x as number;
      }
      visitedPositions.set([x, y].join(","), value as number);
    }
    if (done) break;
  } while (true);

  return score;
};

export default [solution1, solution2];
