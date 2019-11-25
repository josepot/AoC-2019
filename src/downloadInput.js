const fs = require("fs");
const https = require("https");

const [, , day_, year_] = process.argv;
const now = new Date();

const year = year_ || now.getFullYear();
const day = day_ || now.getDate();
const session = process.env.session;

const getFile = () =>
  new Promise((resolve, reject) =>
    https
      .get(
        {
          hostname: "adventofcode.com",
          path: `/${year}/day/${day}/input`,
          method: "GET",
          headers: {
            Cookie: `session=${session}`
          }
        },
        resolve
      )
      .on("error", reject)
  );

const writeFile = stream =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(`./${day}/input`);
    stream.pipe(file);
    file.on("finish", file.close.bind(file, resolve));
    file.on("error", reject);
  });

getFile()
  .then(writeFile)
  .catch(e => {
    console.log("Error downloading the file");
    console.log(e);
  });
