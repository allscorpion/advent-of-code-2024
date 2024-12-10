import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.txt");

const getParsedInput = (input: string) => {
  return input.split("\r\n").map((row) => row.split(""));
};

const getAntennas = (input: string[][]) => {
  const antennas: Record<string, [number, number][]> = {};

  for (let x = 0; x < input.length; x++) {
    const row = input[x];
    for (let y = 0; y < row.length; y++) {
      const column = row[y];
      if (column === ".") continue;

      if (!antennas[column]) {
        antennas[column] = [];
      }

      antennas[column].push([x, y]);
    }
  }

  return antennas;
};

const parseCoords = (coords: string) => {
  return coords.split(",").map(Number);
};

const isValidCoord = (grid: string[][], coords: string) => {
  const [x, y] = parseCoords(coords);
  return typeof grid[x]?.[y] !== "undefined";
};

const drawOnGrid = (grid: string[][], antiNodeCoords: Set<string>) => {
  antiNodeCoords.forEach((coords) => {
    const [x, y] = parseCoords(coords);
    if (grid[x]?.[y]) {
      grid[x][y] = "#";
    }
  });

  console.log(grid.map((row) => row.join("")).join("\r\n"));
};

const part1 = () => {
  const parsedInput = getParsedInput(input);

  const antennas = getAntennas(parsedInput);

  const antiNodeCoords: Set<string> = new Set();

  const addIfValid = (coords: string) => {
    if (!isValidCoord(parsedInput, coords)) {
      return;
    }

    antiNodeCoords.add(coords);
  };

  for (const antenna in antennas) {
    const coords = antennas[antenna];

    let [first, ...rest] = coords;

    while (rest.length) {
      const [x, y] = first;

      rest.forEach((antenna) => {
        const [nextX, nextY] = antenna;

        const distanceX = x - nextX;
        const distanceY = y - nextY;

        addIfValid(`${x + distanceX},${y + distanceY}`);
        addIfValid(`${nextX - distanceX},${nextY - distanceY}`);
      });

      [first, ...rest] = rest;
    }
  }

  return antiNodeCoords.size;
};

const part2 = () => {
  const parsedInput = getParsedInput(input);

  const antennas = getAntennas(parsedInput);

  const antiNodeCoords: Set<string> = new Set();

  const addIfValid = (coords: string) => {
    if (!isValidCoord(parsedInput, coords)) {
      return;
    }

    antiNodeCoords.add(coords);
  };

  for (const antenna in antennas) {
    const coords = antennas[antenna];
    let [first, ...rest] = coords;

    if (coords.length > 1) {
      coords.forEach((coord) => {
        const [x, y] = coord;
        addIfValid(`${x},${y}`);
      });
    }

    while (rest.length) {
      const [x, y] = first;

      rest.forEach((antenna) => {
        let [nextX, nextY] = antenna;

        const distanceX = x - nextX;
        const distanceY = y - nextY;

        let activeX = x;
        let activeY = y;

        let upperCoord = () => `${activeX + distanceX},${activeY + distanceY}`;

        while (isValidCoord(parsedInput, upperCoord())) {
          addIfValid(upperCoord());

          activeX += distanceX;
          activeY += distanceY;
        }

        let lowerCoord = () => `${nextX - distanceX},${nextY - distanceY}`;

        while (isValidCoord(parsedInput, lowerCoord())) {
          addIfValid(lowerCoord());

          nextX -= distanceX;
          nextY -= distanceY;
        }
      });

      [first, ...rest] = rest;
    }
  }

  return antiNodeCoords.size;
};

console.log(part1());
console.log(part2());
