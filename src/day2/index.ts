import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname);

const parseInput = (input: String) => {
  return input.split("\r\n").map((line) => {
    return line.split(" ").map(Number);
  });
};

const isRowSafe = (row: number[]) => {
  let isIncreasing: null | boolean = null;
  for (let i = 0; i < row.length - 1; i++) {
    const currentNum = row[i];
    const nextNum = row[i + 1];

    const difference = currentNum - nextNum;
    const differenceAbs = Math.abs(currentNum - nextNum);

    if (difference === 0 || differenceAbs > 3) {
      return false;
    }

    if (isIncreasing === null) {
      isIncreasing = difference > 0;
    }

    const nextIsIncreasing = difference > 0;

    if (isIncreasing !== nextIsIncreasing) {
      return false;
    }
  }

  return true;
};

const part1 = () => {
  const rows = parseInput(input);

  const parsedRows = rows.filter(isRowSafe);

  return parsedRows.length;
};

const part2 = () => {
  const rows = parseInput(input);

  const getRowPermutations = (arr: number[]) => {
    return arr.map((_, idx) => arr.toSpliced(idx, 1));
  };

  const parsedRows = rows.filter((row) => {
    return isRowSafe(row) || getRowPermutations(row).some(isRowSafe);
  });

  return parsedRows.length;
};

console.log(part1());
console.log(part2());
