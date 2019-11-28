const md5 = require("md5");

const solution1 = input => {
  const x = "000000";
  for (let i = 0; i < Infinity; i++) {
    if (md5(input + i).startsWith(x)) {
      return i;
    }
  }
};

const solution2 = lines => {};

module.exports = [solution1];
