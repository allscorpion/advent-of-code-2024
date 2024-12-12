import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.txt");

const getParsedInput = (input: string, withGroups: boolean): string[][] => {
  const numbers = input.trim().split("").map(Number);

  const output: string[][] = [];

  let id = 0;

  numbers.forEach((number, i) => {
    const isFile = i % 2 === 0;
    const isFreeSpace = !isFile;

    if (number === 0) return;

    if (isFile) {
      const fileBlock: string[] = Array(number).fill(String(id));
      withGroups
        ? output.push(fileBlock)
        : fileBlock.forEach((block) => {
            output.push([block]);
          });
      id++;
    } else if (isFreeSpace) {
      const freeSpaceBlock = Array(number).fill(".");
      output.push(freeSpaceBlock);
    }
  });

  return output;
};

const getIndexesOfFreeSpace = (input: string[][]) => {
  const indexes = [];
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    if (item.includes(".")) {
      indexes.push(i);
    }
  }

  return indexes;
};

const swapItems = (
  input: (string | null)[][],
  item: string[],
  currentIndex: number,
  nextIndex: number
) => {
  input[currentIndex] = input[currentIndex].map(() => {
    return null;
  });
  let itemIndex = 0;
  input[nextIndex] = input[nextIndex].map((freeSpace) => {
    if (freeSpace !== ".") {
      return freeSpace;
    }

    const value = item[itemIndex];
    itemIndex++;
    return value ?? freeSpace;
  });
};

const checksum = (input: (number | ".")[]) => {
  const parsedInput = input;

  return parsedInput.reduce<number>((acc, item, i) => {
    if (item === ".") return acc;
    return acc + item * i;
  }, 0);
};

const swapNumbers = (parsedInput: string[][]) => {
  let indexesOfFreeSpace = getIndexesOfFreeSpace(parsedInput);

  for (let i = parsedInput.length - 1; i > 0; i--) {
    if (!indexesOfFreeSpace.length) {
      break;
    }

    const item = parsedInput[i];

    if (indexesOfFreeSpace.includes(i)) continue;

    checkFreeSpaces(item, i);
  }

  function checkFreeSpaces(item: string[], i: number) {
    const indexesToRemove: number[] = [];

    for (let x = 0; x < indexesOfFreeSpace.length; x++) {
      const indexOfFreeSpace = indexesOfFreeSpace[x];
      if (indexOfFreeSpace > i) {
        indexesToRemove.push(indexOfFreeSpace);
        break;
      }

      const freeSpace = parsedInput[indexOfFreeSpace];

      if (!freeSpace) {
        indexesToRemove.push(indexOfFreeSpace);
        break;
      }

      const freeSpaceLeft = freeSpace.filter((space) => {
        return space === ".";
      }).length;

      if (freeSpaceLeft === 0) {
        indexesToRemove.push(indexOfFreeSpace);
      }

      if (freeSpaceLeft >= item.length) {
        swapItems(parsedInput, item, i, indexOfFreeSpace);
        break;
      }
    }

    if (indexesToRemove.length) {
      indexesOfFreeSpace = indexesOfFreeSpace.filter((index) => {
        return !indexesToRemove.includes(index);
      });
    }
  }
};

const parseResult = (parsedInput: string[][]) => {
  return parsedInput.flatMap((group) => {
    return group.map((item) => {
      return item === null || item === "." ? "." : Number(item);
    });
  });
};

const part1 = () => {
  const parsedInput = getParsedInput(input, false);

  swapNumbers(parsedInput);

  return checksum(parseResult(parsedInput));
};

const part2 = () => {
  const parsedInput = getParsedInput(input, true);

  swapNumbers(parsedInput);

  return checksum(parseResult(parsedInput));
};

console.log(part1());
// 6446899523367
console.log(part2());
// 6478232739671
