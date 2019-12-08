const wide = 25;
const tall = 6;
const digitsInLayer = 25 * 6;
enum Color {
  W = "#",
  B = " ",
  T = "."
}

const colors = [Color.B, Color.W, Color.T];

const solution1 = (layers: number[][][]) => {
  const winner = layers
    .map(layer =>
      layer
        .reduce((a, b) => [...a, ...b], [] as number[])
        .reduce((a, b) => {
          const current = a.get(b) || 0;
          a.set(b, current + 1);
          return a;
        }, new Map<number, number>())
    )
    .sort((a, b) => (a.get(0) || 0) - (b.get(0) || 0))[0];

  return winner.get(1)! * winner.get(2)!;
};

const solution2 = (rawLayers: number[][][]) => {
  const layers = rawLayers.map(layer =>
    layer.map(row => row.map(digit => colors[digit]))
  );

  const getPixelColor = (y: number, x: number): Color =>
    layers
      .map((_, idx) => layers[idx][y][x])
      .find(x => x === Color.B || x === Color.W) || Color.T;

  layers[0].forEach((row, y) => {
    console.log(row.map((_, x) => getPixelColor(y, x)).join(""));
  });
};

export default [solution1, solution2].map(fn => ([line]: string[]) => {
  const nLayers = line.length / digitsInLayer;
  const layers: number[][][] = [];
  for (let l = 0; l < nLayers; l++) {
    const layer: number[][] = [];
    for (let y = 0; y < tall; y++) {
      let pixel: number[] = [];
      for (let x = 0; x < wide; x++) {
        pixel.push(Number(line[l * digitsInLayer + (y * wide + x)]));
      }
      layer.push(pixel);
    }
    layers.push(layer);
  }
  return fn(layers);
});
