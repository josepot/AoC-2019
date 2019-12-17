const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = x => new Promise(res => rl.question(x, res));
module.exports = {
  askQuestion,
  rl
};
