import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.txt");

const getParsedInput = (input: string) => {
  return input.split("\r\n").map((row) => {
    const [target, numbers] = row.split(":");

    return [Number(target), numbers.trim().split(" ")] as const;
  });
};

const addOptions = <T extends any[]>(
  numbers: string[],
  operators: string[],
  options: T,
  i: number
) => {
  const nextNumber = numbers[i + 1];

  if (!nextNumber) {
    return options;
  }

  const nextOptions = options.flatMap((option) => {
    return operators.map((operator) => {
      return option + operator + nextNumber;
    });
  });

  return addOptions(numbers, operators, nextOptions, i + 1);
};

const isNumber = (item: unknown) => {
  return Number.isInteger(Number(item));
};

const handleOption = (option: string): number => {
  const chars = option.split("");

  const parsedChars: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (char === "+" || char === "*") {
      parsedChars.push(char);
      continue;
    }

    if (char === "|") {
      parsedChars.push("||");
      i++;
      continue;
    }

    if (isNumber(parsedChars[parsedChars.length - 1])) {
      parsedChars[parsedChars.length - 1] =
        parsedChars[parsedChars.length - 1] + char;
      continue;
    }

    parsedChars.push(char);
  }

  const result = parsedChars.reduce<number>((acc, char, i) => {
    const nextChar = parsedChars[i + 1];
    const nextNumber = parsedChars[i + 2];

    if (!nextChar || !nextNumber) {
      return acc;
    }

    if (!isNumber(char)) {
      return acc;
    }

    switch (nextChar) {
      case "+":
        return acc + Number(nextNumber);
      case "*":
        return acc * Number(nextNumber);
      case "||":
        return Number(String(acc) + nextNumber);
    }

    return acc;
  }, Number(parsedChars[0]));

  return result;
};

const getTotal = (options: (readonly [number, string[]])[]) => {
  const sum = options.reduce((total, [target]) => {
    return total + target;
  }, 0);

  return sum;
};

const part1 = () => {
  const parsedInput = getParsedInput(input);

  const operators = ["+", "*"];

  const validOptions = parsedInput.filter((row) => {
    const [target, numbers] = row;

    let i = 0;

    const currentNumber = numbers[i];

    const startingOptions = [currentNumber];

    const options = addOptions(numbers, operators, startingOptions, i);

    const parsedOptions = options.map(handleOption);

    return parsedOptions.some((option) => {
      return option === target;
    });
  });

  return getTotal(validOptions);
};

const part2 = () => {
  const parsedInput = getParsedInput(input);

  const operators = ["+", "*", "||"];

  const validOptions = parsedInput.filter((row) => {
    const [target, numbers] = row;

    let i = 0;

    const currentNumber = numbers[i];

    const startingOptions = [currentNumber];

    const options = addOptions(numbers, operators, startingOptions, i);

    const parsedOptions = options.map(handleOption);

    return parsedOptions.some((option) => {
      return option === target;
    });
  });

  return getTotal(validOptions);
};

console.log(part1());
console.log(part2());
