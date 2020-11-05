import { intCodeProcessor } from "utils/intCodeGenerator"

export default [1, 2].map((input) => ([line]: string) =>
  intCodeProcessor<number>(line, () => {}, input),
)
