import nestData from "utils/ts/nestData";

const WIDTH = 25;
const HEIGHT = 6;
enum Color {
  W = "#",
  B = " ",
  T = "."
}
const colors = [Color.B, Color.W, Color.T];

const solution1 = (layers: Color[][][]) =>
  layers
    .map(layer =>
      layer.flat(1).reduce((a, b) => {
        a.set(b, a.get(b)! + 1);
        return a;
      }, new Map<Color, number>(colors.map(color => [color, 0])))
    )
    .sort((a, b) => a.get(Color.B)! - b.get(Color.B)!)
    .filter((_, idx) => idx === 0)
    .map(winner => winner.get(Color.T)! * winner.get(Color.W)!)[0];

const getPixelColor = (y: number, x: number, layers: Color[][][]): Color =>
  layers.map((_, idx) => layers[idx][y][x]).find(x => x !== Color.T) || Color.T;

const solution2 = (layers: Color[][][]) =>
  layers[0]
    .map((row, y) => row.map((_, x) => getPixelColor(y, x, layers)).join(""))
    .join("\n");

export default [solution1, solution2].map(fn => ([line]: string[]) =>
  fn(
    nestData(
      line.split("").map(x => colors[Number(x)]),
      WIDTH,
      HEIGHT
    )
  )
);
