const { compose: c, init, split, tap, ifElse, head } = require("ramda");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const { isObservable } = require("rxjs");
const https = require("https");
const qs = require("querystring");
const getSession = require("./getSession");
const { askQuestion, rl } = require("./utils/askQuestion");

const relPath = path.resolve(__dirname);
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
const getLines = c(
  ifElse(x => x.length > 1, init, head),
  split("\n")
);

const [cmdName, , day_, idx] = process.argv;
const day = day_ || new Date().getDate();

const dayPath = `${relPath}/${day}`;

const mod = cmdName.endsWith("ts-node")
  ? require(`./${day}/solution.ts`)
  : require(`./${day}/solution`);

const fns = mod.default || mod;
const fn =
  idx !== undefined
    ? fns[idx]
    : Array.isArray(fns)
    ? fns.filter(Boolean).slice(-1)[0]
    : fns;

const submitSolution = async (solution, level, session, year) => {
  console.log(
    `Submitting solution ${solution} for day: ${day}, part: ${level}, year: ${year}`
  );
  const postData = qs.stringify({
    level,
    answer: solution
  });

  const result = await new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: "adventofcode.com",
        path: `/${year}/day/${day}/answer`,
        port: 443,
        method: "POST",
        headers: {
          Cookie: `session=${session}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length
        }
      },
      res => {
        let result = "";
        res.on("data", function(chunk) {
          result += chunk;
        });
        res.on("end", function() {
          resolve(result);
        });
        res.on("error", function(err) {
          reject(err);
        });
      }
    );
    request.write(postData);
    request.end();
  });

  const [, main] = result.match(/<main>((.|\n)*)<\/main>/);

  if (main.includes("That's the right answer!")) {
    return console.log("\x1b[32m", "That's right!");
  }

  const wrongMatch = main.match(
    /That's not the right answer;?\s?((.|\n)*)If you're stuck/
  );
  if (wrongMatch) {
    return console.log("\x1b[31m", `Wrong! ${wrongMatch[1]}`);
  }

  const waitMatch = main.match(/You\shave\s(\d*)s\sleft\sto\swait/);

  if (waitMatch) {
    const secsToWait = Number(waitMatch[1]);
    console.log(`Waiting ${secsToWait} seconds before re-submitting...`);
    await new Promise(res => setTimeout(res, secsToWait * 1000));
    return await submitSolution(solution, level, session, year);
  }

  console.log(main);
};

const defaultPart = Array.isArray(fns) && fns.length;

const submit = async solution => {
  try {
    const session = await getSession();
    if (!session) return;

    const part_ = await askQuestion(`submit part? (${defaultPart})`);
    const part = !part_ ? defaultPart : Number(part_);
    if (Number.isNaN(part)) return;

    const defaultYear = new Date().getFullYear();
    const year_ = await askQuestion(`year? (${defaultYear})`);
    const year = !year_ ? defaultYear : year_;

    await submitSolution(solution, part, session, year);
  } finally {
    rl.close();
  }
};

readFile(`${dayPath}/input`, "utf-8")
  .then(
    c(
      tap(() => (start = Date.now())),
      getLines
    )
  )
  .then(lines => fn(lines))
  .then(result => {
    log(result);
    submit(result);
  });
