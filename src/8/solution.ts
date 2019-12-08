const solution1 = ([line]: string) => {
  const wide = 25;
  const tall = 6;
  const digitsInLayer = 25 * 6;

  const nLayers = line.length / digitsInLayer;
  console.log("nLayers", nLayers);
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

enum Color {
  W = "white",
  B = "black",
  T = "transparent"
}

const solution2 = ([line]: string) => {
  const wide = 25;
  const tall = 6;
  const digitsInLayer = 25 * 6;

  const nLayers = line.length / digitsInLayer;
  console.log("nLayers", nLayers);
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

  const getPixelInLayer = (y: number, x: number, layerIdx: number): Color => {
    const digit = layers[layerIdx][y][x];
    return digit === 0 ? Color.B : digit === 1 ? Color.W : Color.T;
  };

  const getPixelColor = (y: number, x: number): Color => {
    return (
      layers
        .map((_, idx) => getPixelInLayer(y, x, idx))
        .find(x => x === Color.B || x === Color.W) || Color.T
    );
  };

  const rows: string[] = [];
  for (let y = 0; y < tall; y++) {
    const colors: Color[] = [];
    for (let x = 0; x < wide; x++) {
      colors.push(getPixelColor(y, x));
    }
    rows.push(
      colors
        .map(x => (x === Color.B ? " " : x === Color.W ? "#" : "."))
        .join("")
    );
  }

  rows.forEach(row => console.log(row));
};

export default [solution1, solution2];
