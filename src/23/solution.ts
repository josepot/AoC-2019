import { intCodeProcessors } from "utils/ts/intCodeGenerator";

const emptyResult = [-1];
const solution1 = ([line]: string[]) => {
  let result: number | undefined = undefined;
  const inputs = Array(50)
    .fill(null)
    .map((_, idx) => [idx] as number[]);

  intCodeProcessors(
    line,
    50,
    (_, address, x, y) => {
      if (address === 255) {
        return (result = y);
      }
      inputs[address].push(x, y);
    },
    idx => {
      if (result) return undefined;
      const res = inputs[idx].splice(0, 2);
      return res.length === 0 ? emptyResult : res;
    }
  );
  return result;
};

const solution2 = ([line]: string[]) => {
  const inputs = Array(50)
    .fill(null)
    .map((_, idx) => [idx] as number[]);
  let natPacket: [number, number] | undefined = undefined;
  let lastYDeliveredByNat: number | undefined = undefined;

  let result: number | undefined = undefined;
  let idleCounter = 0;
  intCodeProcessors(
    line,
    50,
    (_, address, x, y) => {
      if (address === 255) {
        natPacket = [x, y];
      } else {
        inputs[address].push(x, y);
      }
    },
    idx => {
      if (result) return undefined;
      const res = inputs[idx].splice(0, 2);
      return res.length === 0 ? emptyResult : res;
    },
    () => {
      if (natPacket && inputs.every(i => i.length === 0)) {
        idleCounter++;
      }
      if (idleCounter > 5 && natPacket) {
        idleCounter = 0;
        if (lastYDeliveredByNat === natPacket[1]) {
          result = lastYDeliveredByNat;
        } else {
          lastYDeliveredByNat = natPacket[1];
          inputs[0].push(...natPacket);
        }
      }
    }
  );
  return result;
};

export default [solution1, solution2];
