import { intCodeProcessor } from "utils/ts/intCodeGenerator";
import { getDirectionWheel, movePosition, Position } from "utils/ts/directions";
import printPositionsMap from "utils/ts/printPositionsMap";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";
const readline = require("readline");
const askQuestion = (x: string) => new Promise(res => rl.question(x, res));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const positionToKey = (x: Position) => x.x + "," + x.y;

interface Node {
  id: string;
  value: number;
  steps: number;
}
const solution1 = async ([line]: string) => {
  const visitedPositions = new Map<string, number>();
  let currentPosition = { x: 0, y: 0 };
  let directionWheel = getDirectionWheel();

  const getNextPositions = (id: string, currenSteps: number) => {
    const [x, y] = id.split(",").map(Number);
    const result = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ]
      .map(([x, y]) => positionToKey({ x, y }))
      .map(id => {
        const value = visitedPositions.get(id)!;
        const steps = currenSteps + 1;
        return { id: id, value, steps } as Node;
      })
      .filter(x => x.value === 1 || x.value === 2);
    return result;
  };

  async function solveMazze() {
    return graphDistinctSearch(
      { id: "0,0", steps: 0, value: 0 } as Node,
      (x: Node) => x.value === 2 || getNextPositions(x.id, x.steps),
      (a: Node, b: Node) => b.steps - a.steps
    ).steps;
  }

  let i = 0;
  await intCodeProcessor<number>(
    line,
    (status: number) => {
      const nextPosition = movePosition(currentPosition, directionWheel.value);
      visitedPositions.set(positionToKey(nextPosition), status);
      if (status > 0) {
        currentPosition = nextPosition;
      }
      const targetDirection = Math.floor(Math.random() * 4);
      for (let i = 0; i < targetDirection; i++) {
        directionWheel = directionWheel.left;
      }
    },
    async () => {
      i++;
      if (i % 100000 === 0) {
        visitedPositions.set("0,0", 3);
        console.log(
          printPositionsMap(
            visitedPositions,
            x => ["#", ".", "*", "S"][x] ?? "?"
          )
        );

        const keepGoing = await askQuestion("keep drawing?");
        if (keepGoing === "y") {
          return directionWheel.value;
        }
        const steps = await solveMazze();
        console.log("solved", steps);
      }
      return directionWheel.value;
    }
  );

  return [...visitedPositions.values()].filter(x => x === 2).length;
};

export default [solution1];
// export default [solution1, solution2];
