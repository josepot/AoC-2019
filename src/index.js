const { compose: c, init, split, tap } = require("ramda");
const { promisify } = require("util");
const fs = require("fs");
const { isObservable } = require("rxjs");

let start;
const log = v => {
  let end = Date.now();
  if (isObservable(v)) {
    return v.subscribe(console.log, console.error);
  }
  console.log(v);
  console.log(`Solved in ${end - start}ms`);
};
const readFile = promisify(fs.readFile);
const getLines = c(init, split("\n"));

const [, , day_, idx] = process.argv;
const day = day_ || new Date().getDate();

const fns = require(`./${day}/solution`);
const fn =
  idx !== undefined
    ? fns[idx]
    : Array.isArray(fns)
    ? fns.filter(Boolean).slice(-1)[0]
    : fns;

readFile(`./${day}/input`, "utf-8").then(
  c(
    log,
    fn,
    tap(() => (start = Date.now())),
    getLines
  )
);
