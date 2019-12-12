import intCodeGenerator from "utils/ts/intCodeGenerator";
const solution = (line: string, input: number) => {
  const gen = intCodeGenerator(line);
  gen.next();
  return gen.next(input).value;
};

export default [1, 2].map(input => ([line]: string) => solution(line, input));
