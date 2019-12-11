export default function printPositionsMap<T>(
  map: Map<string, T>,
  cellMapper: (
    val: T,
    x: number,
    y: number,
    originalX: number,
    originalY: number
  ) => string
) {
  const limits = [...map.keys()]
    .map(x => x.split(",").map(Number) as [number, number])
    .reduce(
      (acc, [x, y]) => ({
        left: Math.min(acc.left, x),
        right: Math.max(acc.right, x),
        top: Math.min(acc.top, y),
        bottom: Math.max(acc.bottom, y)
      }),
      { left: 0, right: 0, top: 0, bottom: 0 }
    );
  const width = limits.right - limits.left + 1;
  const hight = limits.bottom - limits.top + 1;

  return Array(hight)
    .fill(null)
    .map((_, yDelta) => yDelta + limits.top)
    .map((y, yy) =>
      Array(width)
        .fill(null)
        .map((_, xDelta) => xDelta + limits.left)
        .map((x, xx) => cellMapper(map.get([x, y].join(","))!, xx, yy, x, y))
        .join("")
    )
    .join("\n");
}
