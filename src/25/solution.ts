import { intCodeProcessor2 } from "utils/ts/intCodeGenerator";
import printPositionsMap from "utils/ts/printPositionsMap";
import { askQuestion } from "utils/askQuestion";

let positions = new Map<string, number>();
let currentX = 0;
let currentY = 0;
const buildGtrid = (c: number) => {
  if (c === 10) {
    currentX = 0;
    currentY++;
    return;
  }
  positions.set(currentX + "," + currentY, c);
  currentX++;
};

const steps: string[] = [];
const savedInstructions = [
  "south",
  "east",
  "east",
  "take bowl of rice",
  "north",
  "north",
  "take spool of cat6",
  "west",
  "north",
  "east",
  "south",
  "take klein bottle",
  "south",
  "south",
  "north",
  "west",
  "west",
  "take space heater",
  "north",
  "north",
  "south",
  "east",
  "east",
  "take bowl of rice",
  "north",
  "north",
  "take spool of cat6",
  "west",
  "north",
  "east",
  "south",
  "take klein bottle",
  "south",
  "south",
  "north",
  "west",
  "west",
  "take space heater",
  "north",
  "north",
  "west",
  "east",
  "south",
  "east",
  "south",
  "north",
  "west",
  "east",
  "south",
  "north",
  "west",
  "north",
  "west",
  "east",
  "south",
  "south",
  "east",
  "inv",
  "drop bowl or rice",
  "drop bowl of rice",
  "inv",
  "north",
  "west",
  "north",
  "south",
  "south",
  "take antenna",
  "inv",
  "north",
  "east",
  "south",
  "east",
  "north",
  "north",
  "west",
  "north"
];

/*
-------------------
-- WINNING ITEMS --
-------------------
space heater
antenna
spool of cat6
klein bottle
 */
const solution1 = async ([line]: string[]) => {
  await intCodeProcessor2(line, buildGtrid, async () => {
    console.log(
      printPositionsMap(positions, x =>
        x === undefined ? "" : String.fromCharCode(x)
      )
    );
    const instruction =
      savedInstructions.splice(0, 1)[0] ||
      (await (askQuestion("what now?") as Promise<string>));
    steps.push(instruction);
    if (!instruction) return [Infinity];
    positions = new Map<string, number>();
    currentX = 0;
    currentY = 0;
    return instruction
      .split("")
      .map(x => (x === "\n" ? 10 : x.charCodeAt(0)))
      .concat(10);
  });
  console.log(
    printPositionsMap(positions, x =>
      x === undefined ? "" : String.fromCharCode(x)
    )
  );
  console.log(JSON.stringify(steps));
};

export default [solution1];
