import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.example.txt");

const getParsedInput = (input: string) => {
  const numbers = input.trim().split("").map(Number);

  const output: string[] = [];

  let id = 0;

  numbers.forEach((number, i) => {
    const isFile = i % 2 === 0;
    const isFreeSpace = !isFile;

    if (number === 0) return;

    if (isFile) {
      const fileBlock = Array(number).fill(String(id));
      output.push(...fileBlock);
      id++;
    } else if (isFreeSpace) {
      const freeSpaceBlock = Array(number).fill(".");
      output.push(...freeSpaceBlock);
    }
  });

  return output;
};

const getIndexesOfFreeSpace = (input: string[]) => {
  const indexes = [];
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    if (item === ".") {
      indexes.push(i);
    }
  }

  return indexes;
};

const swapItems = (
  input: string[],
  currentIndex: number,
  nextIndex: number
) => {
  const temp = input[currentIndex];
  input[currentIndex] = input[nextIndex];
  input[nextIndex] = temp;
};

const checksum = (input: string[]) => {
  const parsedInput = input;

  return parsedInput.reduce((acc, item, i) => {
    if (item === ".") return acc;
    return acc + Number(item) * i;
  }, 0);
};

const swapNumbers = (parsedInput: string[]) => {
  const indexesOfFreeSpace = getIndexesOfFreeSpace(parsedInput);
  let freeSpaceIndex = 0;

  for (let i = parsedInput.length - 1; i > 0; i--) {
    const item = parsedInput[i];

    if (item === ".") continue;

    const indexOfFirstFreeSpace = indexesOfFreeSpace[freeSpaceIndex];

    if (indexOfFirstFreeSpace && i > indexOfFirstFreeSpace) {
      swapItems(parsedInput, i, indexOfFirstFreeSpace);
      freeSpaceIndex++;
    } else {
      return;
    }
  }
};

const part1 = () => {
  const parsedInput = getParsedInput(input);

  swapNumbers(parsedInput);

  return checksum(parsedInput);
};

const getParsedInputPart2 = (input: string) => {
  const numbers = input.trim().split("").map(Number);

  const output: string[][] = [];

  let id = 0;

  numbers.forEach((number, i) => {
    const isFile = i % 2 === 0;
    const isFreeSpace = !isFile;

    if (number === 0) return;

    if (isFile) {
      const fileBlock = Array(number).fill(String(id));
      output.push(fileBlock);
      id++;
    } else if (isFreeSpace) {
      const freeSpaceBlock = Array(number).fill(".");
      output.push(freeSpaceBlock);
    }
  });

  return output;
};

const getIndexesOfFreeSpacePart2 = (input: string[][]) => {
  const indexes = [];
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    if (item.includes(".")) {
      indexes.push(i);
    }
  }

  return indexes;
};

const swapItemsPart2 = (
  input: string[][],
  item: string[],
  currentIndex: number,
  nextIndex: number
) => {
  input[currentIndex] = input[currentIndex].map(() => {
    return ".";
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

const part2 = () => {
  const parsedInput = getParsedInputPart2(input);

  const indexesOfFreeSpace = getIndexesOfFreeSpacePart2(parsedInput);

  for (let i = parsedInput.length - 1; i > 0; i--) {
    const item = parsedInput[i];

    if (indexesOfFreeSpace.includes(i)) continue;

    checkFreeSpaces(item, i);
  }

  function checkFreeSpaces(item: string[], i: number) {
    for (
      let freeSpaceIndex = 0;
      freeSpaceIndex < indexesOfFreeSpace.length;
      freeSpaceIndex++
    ) {
      const freeSpace = parsedInput[freeSpaceIndex];
      const freeSpaceLeft = freeSpace.filter((space) => {
        return space === ".";
      }).length;

      if (freeSpaceLeft >= item.length) {
        swapItemsPart2(parsedInput, item, i, freeSpaceIndex);
        return;
      }
    }
  }
  return checksum(
    parsedInput
      .map((group) => group.join(""))
      .join("")
      .split("")
  );
};

console.log(part1());
console.log(part2());

// 00992111777.44.333....5555.6666.....8888..
// 00992111777.44.333....5555.6666.....8888..
