import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.txt");

const getParsedInput = (input: string) => {
  return input.split("\r\n").map((str) => str.split(""));
};

const goRight = (x: number, y: number) => ({ x, y: y + 1 });
const goLeft = (x: number, y: number) => ({ x, y: y - 1 });
const goTop = (x: number, y: number) => ({ x: x - 1, y });
const goTopRight = (x: number, y: number) => ({
  x: x - 1,
  y: y + 1,
});
const goTopLeft = (x: number, y: number) => ({
  x: x - 1,
  y: y - 1,
});
const goBottom = (x: number, y: number) => ({ x: x + 1, y });
const goBottomRight = (x: number, y: number) => ({
  x: x + 1,
  y: y + 1,
});
const goBottomLeft = (x: number, y: number) => ({
  x: x + 1,
  y: y - 1,
});

type DirectionFunc = (
  x: number,
  y: number
) => {
  x: number;
  y: number;
};

const part1 = () => {
  const parsedInput = getParsedInput(input);

  const letters = ["X", "M", "A", "S"];

  const directions: DirectionFunc[] = [
    goRight,
    goLeft,
    goTop,
    goTopRight,
    goTopLeft,
    goBottom,
    goBottomRight,
    goBottomLeft,
  ];

  let totalXmas = 0;

  for (let x = 0; x < parsedInput.length; x++) {
    const activeRow = parsedInput[x];
    for (let y = 0; y < activeRow.length; y++) {
      const letter = activeRow[y];

      if (letter !== letters[0]) {
        continue;
      }

      const search = (
        lettersIndex: number,
        currentX: number,
        currentY: number,
        direction: DirectionFunc
      ) => {
        const letterToFind = letters[lettersIndex];

        if (!letterToFind) {
          totalXmas += 1;
          return;
        }

        const coords = direction(currentX, currentY);

        const currentLetter = parsedInput[coords.x]?.[coords.y];

        if (letterToFind !== currentLetter) return;

        search(lettersIndex + 1, coords.x, coords.y, direction);
      };

      directions.forEach((direction) => {
        search(1, x, y, direction);
      });
    }
  }

  return totalXmas;
};

const part2 = () => {
  const parsedInput = getParsedInput(input);
  const letters = ["M", "A", "S"];

  let totalXmas = 0;

  const directions = [
    {
      forward: goTopRight,
      backward: goBottomLeft,
    },
    {
      forward: goBottomRight,
      backward: goTopLeft,
    },
  ];

  for (let x = 0; x < parsedInput.length; x++) {
    const activeRow = parsedInput[x];
    for (let y = 0; y < activeRow.length; y++) {
      const letter = activeRow[y];

      if (letter !== letters[1]) {
        continue;
      }

      let masCount = 0;

      directions.forEach((direction) => {
        const letterCoords = direction.backward(x, y);
        const oppositeLetterCoords = direction.forward(x, y);

        const letter = parsedInput[letterCoords.x]?.[letterCoords.y];
        const oppositeLetter =
          parsedInput[oppositeLetterCoords.x]?.[oppositeLetterCoords.y];

        if (
          (letter === letters[0] && oppositeLetter === letters[2]) ||
          (letter === letters[2] && oppositeLetter === letters[0])
        ) {
          masCount += 1;
        }
      });

      if (masCount === directions.length) {
        totalXmas += 1;
      }
    }
  }

  return totalXmas;
};

console.log(part1());
console.log(part2());
