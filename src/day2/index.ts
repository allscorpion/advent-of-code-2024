import { dirname } from "path";
import { fileURLToPath } from "url";
import { getInput } from "../utils/get-input.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = getInput(__dirname);

const parseInput = (input: String) => {
  return input.split("\r\n").map((line) => {
    return line.split(" ").map(Number);
  });
};

const part1 = () => {
  const rows = parseInput(input);

  const parsedRows = rows.filter((row) => {
    let isIncreasing: null | boolean = null;

    const getIsSafe = () => {
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

    const isSafe = getIsSafe();

    return isSafe;
  });

  return parsedRows.length;
};

const part2 = () => {
  const rows = parseInput(input);

  const parsedRows = rows.filter((row) => {
    const isRowSafe = (innerRow: number[]) => {
      let isIncreasing: null | boolean = null;

      for (let i = 0; i < innerRow.length - 1; i++) {
        const currentNum = innerRow[i];
        const nextNum = innerRow[i + 1];

        const difference = currentNum - nextNum;
        const differenceAbs = Math.abs(currentNum - nextNum);

        if (difference === 0 || differenceAbs > 3) {
          return false;
        }

        if (isIncreasing === null) {
          isIncreasing = difference >= 0;
        }

        const nextIsIncreasing = difference >= 0;

        if (isIncreasing !== nextIsIncreasing) {
          return false;
        }
      }

      return true;
    };

    function getRowPermutations(arr: number[]) {
      return arr.map((_, idx) => arr.toSpliced(idx, 1));
    }

    return isRowSafe(row) || getRowPermutations(row).some(isRowSafe);
  });

  return parsedRows.length;
};

console.log(part1());
console.log(part2());
