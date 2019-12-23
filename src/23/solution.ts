import { intCodeProcessors } from "utils/ts/intCodeGenerator";
import Queue from "utils/ts/Queue";

const solution1 = ([line]: string[]) => {
  let result: number | undefined = undefined;
  const inputs = Array(50)
    .fill(null)
    .map((_, idx) => new Queue<number>(idx));

  intCodeProcessors(
    line,
    50,
    (_, address, x, y) => {
      if (address === 255) {
        return (result = y);
      }
      inputs[address].push(x, y);
    },
    idx => (result !== undefined ? Infinity : inputs[idx].pop() ?? -1)
  );
  return result;
};

const solution2 = ([line]: string[]) => {
  const inputs = Array(50)
    .fill(null)
    .map((_, idx) => new Queue<number>(idx));
  let natPacket: [number, number] | undefined = undefined;
  let lastYDeliveredByNat: number | undefined = undefined;

  let result: number | undefined = undefined;
  let idleCounter = 0;
  intCodeProcessors(
    line,
    50,
    (_, address, x, y) => {
      if (address === 255) {
        return (natPacket = [x, y]);
      }
      inputs[address].push(x, y);
    },
    idx => {
      if (result) return Infinity;
      const out = inputs[idx].pop() ?? -1;
      if (
        idx === 0 &&
        out === -1 &&
        natPacket &&
        inputs.every(i => i.peek() === undefined)
      ) {
        idleCounter++;
      }
      if (idleCounter > 5 && natPacket) {
        idleCounter = 0;
        if (lastYDeliveredByNat === natPacket[1]) {
          result = lastYDeliveredByNat;
          return Infinity;
        }
        lastYDeliveredByNat = natPacket[1];
        inputs[0].push(...natPacket);
      }
      return out;
    }
  );
  return result;
};

export default [solution1, solution2];
