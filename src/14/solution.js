const solution1 = lines => {
  const racers = [];
  lines.forEach(line => {
    const [, , speed, flyTime, restTime] = line.match(
      /^(\w*) can fly (\d*) km\/s for (\d*) seconds, but then must rest for (\d*) seconds./
    );
    const racer = [speed, flyTime, restTime].map(x => parseInt(x, 10));
    racers.push([
      { isRuning: true, nextChange: racer[1], total: 0, points: 0 },
      ...racer
    ]);
  });

  for (let t = 0; t < 2503; t++) {
    let maxTotal = 0;
    racers.forEach(([state, speed, flyTime, restTime]) => {
      if (state.nextChange === t) {
        if (state.isRuning) {
          state.nextChange = t + restTime;
        } else {
          state.nextChange = t + flyTime;
        }
        state.isRuning = !state.isRuning;
      }
      if (state.isRuning) {
        state.total += speed;
      }

      maxTotal = Math.max(maxTotal, state.total);
    });

    racers.forEach(racer => {
      if (racer[0].total === maxTotal) {
        racer[0].points++;
      }
    });
  }
  return Math.max(...racers.map(([s]) => s.points));
};

const solution2 = lines => {};

module.exports = [solution1];
