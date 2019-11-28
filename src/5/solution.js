const forbidden = ["ab", "cd", "pq", "xy"];
const hasForbidden = x => forbidden.some(f => x.indexOf(f) > -1);

const vowels = new Set(["a", "e", "i", "o", "u"]);

const hasOthers = x => {
  let foundVowels = 0;
  let hasRepeated = false;

  for (let i = 0; i < x.length; i++) {
    const char = x[i];
    const prevChar = x[i - 1];

    if (vowels.has(char)) {
      foundVowels++;
    }
    hasRepeated = hasRepeated || char === prevChar;

    if (hasRepeated && foundVowels > 2) return true;
  }
  return false;
};

const isNice = x => !hasForbidden(x) && hasOthers(x);

const isNicer = str => {
  const pairs = {};
  let hasPair = false;
  let hasRepeated = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];

    if (!hasPair) {
      if (pairs[char + nextChar] !== undefined) {
        if (i > pairs[char + nextChar] + 1) {
          hasPair = true;
        }
      } else {
        pairs[char + nextChar] = i;
      }
    }
    hasRepeated = hasRepeated || char === str[i + 2];

    if (hasPair && hasRepeated) return true;
  }
  return false;
};

const solution1 = lines => {
  return lines.filter(isNicer).length;
};

const solution2 = lines => {
  return lines.filter(isNice).length;
};

module.exports = [solution1];
