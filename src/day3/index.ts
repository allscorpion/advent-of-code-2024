import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname);

const getParsedInput = (input: string) => {
  const regex = new RegExp(/do\(\)|don't\(\)|mul\([0-9]{1,3},[0-9]{1,3}\)/g);
  return [...input.matchAll(regex)].map((item) => item[0]);
};

const getTotal = (input: string[]) => {
  let total = 0;
  input.forEach((mul) => {
    const [leftNum, rightNum] = mul
      .substring(4, mul.length - 1)
      .split(",")
      .map(Number);
    total += leftNum * rightNum;
  });

  return total;
};

const part1 = () => {
  const parsedInput = getParsedInput(input).filter((item) => {
    return item.startsWith("mul");
  });

  return getTotal(parsedInput);
};

const part2 = () => {
  const parsedInput = getParsedInput(input);
  const filteredInput: string[] = [];

  let isAllowed = true;
  parsedInput.forEach((item) => {
    if (item.startsWith("mul") && isAllowed) {
      filteredInput.push(item);
    } else if (item === "do()") {
      isAllowed = true;
    } else if (item === "don't()") {
      isAllowed = false;
    }
  });

  return getTotal(filteredInput);
};

console.log(part1());
console.log(part2());
