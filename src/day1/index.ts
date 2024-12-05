import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname);

type ParsedInputType = [number[], number[]];

const parseInput = (input: string): ParsedInputType => {
  const parsedInput = input
    .split("\r\n")
    .map((line) => {
      return line.replace(/\s\s+/g, " ").split(" ");
    })
    .reduce<ParsedInputType>(
      (acc, arr) => {
        const [first, second] = arr;
        acc[0].push(Number(first));
        acc[1].push(Number(second));
        return acc;
      },
      [[], []] as const
    );

  return parsedInput;
};

const sortInput = (input: ParsedInputType): ParsedInputType => {
  const newInput: ParsedInputType = [[], []];
  newInput[0] = input[0].toSorted();
  newInput[1] = input[1].toSorted();
  return newInput;
};

const [firstArr, secondArr] = sortInput(parseInput(input));

const part1 = () => {
  let total = 0;

  for (let i = 0; i < firstArr.length; i++) {
    const element = firstArr[i];
    const secondElement = secondArr[i];

    const result = Math.abs(element - secondElement);
    total += result;
  }

  return total;
};

const part2 = () => {
  let total = 0;

  for (let i = 0; i < firstArr.length; i++) {
    const firstNum = firstArr[i];

    const itemsInSecondArr = secondArr.filter((num) => {
      return num === firstNum;
    });

    const totalItemsInSecondArr = itemsInSecondArr.length;

    total += firstNum * totalItemsInSecondArr;
  }

  return total;
};

console.log(part1());
console.log(part2());
