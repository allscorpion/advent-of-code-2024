import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.txt");

const getParsedInput = (input: string) => {
  const numbers = input.trim().split("").map(Number);

  const output: string[] = [];

  let id = 0;

  numbers.forEach((number, i) => {
    const isFile = i % 2 === 0;
    const isFreeSpace = !isFile;

    if (number === 0) return;

    if (isFile) {
      output.push(...Array(number).fill(String(id)));
      id++;
    } else if (isFreeSpace) {
      output.push(...Array(number).fill("."));
    }
  });

  return output;
};

const getIndexOfFirstFreeSpace = (input: string[]) => {
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    if (item === ".") {
      return i;
    }
  }

  return;
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
  for (let i = parsedInput.length - 1; i > 0; i--) {
    const indexOfFirstFreeSpace = getIndexOfFirstFreeSpace(parsedInput);

    const item = parsedInput[i];

    if (item === ".") continue;

    if (indexOfFirstFreeSpace && i > indexOfFirstFreeSpace) {
      swapItems(parsedInput, i, indexOfFirstFreeSpace);
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

const part2 = () => {
  const parsedInput = getParsedInput(input);
};

console.log(part1());
// console.log(part2());
