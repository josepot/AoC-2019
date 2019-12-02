export {};

const solution = (a: number, b: number, instructions: number[]) => {
  instructions[1] = a;
  instructions[2] = b;

  let currentIdx = 0;
  while (instructions[currentIdx] !== 99) {
    const instruction = instructions[currentIdx];
    const input1Idx = instructions[currentIdx + 1];
    const input2Idx = instructions[currentIdx + 2];
    const outputIdx = instructions[currentIdx + 3];

    let result: number;
    if (instruction === 1) {
      result = instructions[input2Idx] + instructions[input1Idx];
    } else if (instruction === 2) {
      result = instructions[input2Idx] * instructions[input1Idx];
    } else {
      throw new Error("Something went wrong " + instruction);
    }
    instructions[outputIdx] = result;
    currentIdx += 4;
  }

  return instructions[0];
};
const solution1 = (lines: string[]) =>
  solution(12, 2, lines[0].split(",").map(Number));

const solution2 = (lines: string[]) => {
  const instructions = lines[0].split(",").map(Number);
  for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
      const newInstructions = [...instructions];
      if (solution(a, b, newInstructions) === 19690720)
        return 100 * newInstructions[1] + newInstructions[2];
    }
  }
  return "Something bad happened";
};

module.exports = [solution1, solution2];
