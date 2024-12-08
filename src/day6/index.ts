import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.txt");

const getParsedInput = (input: string) => {
  return input.split("\r\n").map((row) => row.split(""));
};

const goTop = (x: number, y: number) => {
  return { x, y: y - 1 };
};

const goRight = (x: number, y: number) => {
  return { x: x + 1, y };
};

const goBottom = (x: number, y: number) => {
  return { x, y: y + 1 };
};

const goLeft = (x: number, y: number) => {
  return { x: x - 1, y: y };
};

const directions = [goTop, goRight, goBottom, goLeft];

const renderGrid = (grid: string[][]) => {
  console.log(grid.map((row) => row.join("")).join("\r\n"));
};

const getTotal = (input: string[][]) => {
  const sum = input.reduce((total, row) => {
    return (
      total +
      row.reduce((subtotal, column) => {
        if (column === "X") {
          return subtotal + 1;
        }

        return subtotal;
      }, 0)
    );
  }, 0);

  return sum;
};

const part1 = () => {
  const parsedInput = getParsedInput(input);

  const activeRowIndex = parsedInput.findIndex((row) => {
    return row.some((column) => column === "^");
  });

  const activeColumnIndex = parsedInput[activeRowIndex].findIndex((column) => {
    return column === "^";
  });

  let currentDirectionIndex = 0;

  parsedInput[activeRowIndex][activeColumnIndex] = "X";

  let currentDirection = directions[currentDirectionIndex];
  let currentCoords = { x: activeColumnIndex, y: activeRowIndex };

  let walking = true;

  while (walking) {
    let nextSquareCords = currentDirection(currentCoords.x, currentCoords.y);
    let nextSquare = parsedInput[nextSquareCords.y]?.[nextSquareCords.x];

    if (!nextSquare) {
      walking = false;
      continue;
    }

    if (nextSquare === "#") {
      currentDirectionIndex =
        currentDirectionIndex + 1 === directions.length
          ? 0
          : currentDirectionIndex + 1;
      currentDirection = directions[currentDirectionIndex];
      continue;
    }

    if (nextSquare === ".") {
      parsedInput[nextSquareCords.y][nextSquareCords.x] = "X";
    }

    currentCoords = nextSquareCords;
  }

  renderGrid(parsedInput);

  return getTotal(parsedInput);
};

const getAllCustomGrids = (input: string[][]) => {
  const customGridOptions: string[][][] = [];

  const addCustomGrid = (y: number, x: number) => {
    const customGrid = input.map((row) => {
      return row.map((column) => column);
    });

    if (customGrid[y][x] === ".") {
      customGrid[y][x] = "#";
    }

    customGridOptions.push(customGrid);
  };

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      addCustomGrid(y, x);
    }
  }

  return customGridOptions;
};

const part2 = () => {
  const parsedInput = getParsedInput(input);

  const activeRowIndex = parsedInput.findIndex((row) => {
    return row.some((column) => column === "^");
  });

  const activeColumnIndex = parsedInput[activeRowIndex].findIndex((column) => {
    return column === "^";
  });

  const customGrids = getAllCustomGrids(parsedInput);

  let isStuckCount = 0;

  customGrids.forEach((customGrid, i) => {
    let currentDirectionIndex = 0;

    const directionsShifts: {
      x: number;
      y: number;
      direction: (x: number, y: number) => { x: number; y: Number };
    }[] = [];

    let currentDirection = directions[currentDirectionIndex];

    let currentCoords = { x: activeColumnIndex, y: activeRowIndex };
    let walking = true;

    while (walking) {
      let nextSquareCords = currentDirection(currentCoords.x, currentCoords.y);
      let nextSquare = customGrid[nextSquareCords.y]?.[nextSquareCords.x];

      if (!nextSquare) {
        walking = false;
        continue;
      }

      if (nextSquare === "#") {
        currentDirectionIndex =
          currentDirectionIndex + 1 === directions.length
            ? 0
            : currentDirectionIndex + 1;
        currentDirection = directions[currentDirectionIndex];

        const directionShift = {
          x: nextSquareCords.x,
          y: nextSquareCords.y,
          direction: currentDirection,
        };

        const hasSeenSquareBefore = directionsShifts.some((shift) => {
          return (
            shift.direction === directionShift.direction &&
            shift.x === directionShift.x &&
            shift.y === directionShift.y
          );
        });

        if (hasSeenSquareBefore) {
          isStuckCount += 1;
          walking = false;
          continue;
        }

        directionsShifts.push(directionShift);
        continue;
      }

      currentCoords = nextSquareCords;
    }
  });

  return isStuckCount;
};

console.log(part1());
console.log(part2());
