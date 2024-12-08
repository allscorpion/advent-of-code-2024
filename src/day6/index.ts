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

  const activeColumnIndex = parsedInput.findIndex((row) => {
    return row.some((column) => column === "^");
  });

  const activeRowIndex = parsedInput[activeColumnIndex].findIndex((column) => {
    return column === "^";
  });

  let currentDirectionIndex = 0;

  parsedInput[activeColumnIndex][activeRowIndex] = "X";

  let currentDirection = directions[currentDirectionIndex];

  let activeSquareCords = currentDirection(activeRowIndex, activeColumnIndex);
  let activeSquare = parsedInput[activeSquareCords.y]?.[activeSquareCords.x];

  while (activeSquare) {
    if (activeSquare === "." || activeSquare === "X") {
      parsedInput[activeSquareCords.y][activeSquareCords.x] = "X";

      const prevCoords = activeSquareCords;

      activeSquareCords = currentDirection(
        activeSquareCords.x,
        activeSquareCords.y
      );

      activeSquare = parsedInput[activeSquareCords.y]?.[activeSquareCords.x];

      if (activeSquare === "#") {
        currentDirectionIndex =
          currentDirectionIndex + 1 === directions.length
            ? 0
            : currentDirectionIndex + 1;
        currentDirection = directions[currentDirectionIndex];

        activeSquareCords = prevCoords;

        activeSquare = parsedInput[activeSquareCords.y]?.[activeSquareCords.x];
        continue;
      }
      continue;
    }
    if (activeSquare === "#") {
      console.log("square hit");
      return;
    }
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

  const activeColumnIndex = parsedInput.findIndex((row) => {
    return row.some((column) => column === "^");
  });

  const activeRowIndex = parsedInput[activeColumnIndex].findIndex((column) => {
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

    let activeSquareCords = currentDirection(activeRowIndex, activeColumnIndex);
    let activeSquare: string | undefined =
      customGrid[activeSquareCords.y]?.[activeSquareCords.x];

    while (activeSquare) {
      if (activeSquare === "." || activeSquare === "^") {
        const prevCoords = activeSquareCords;

        activeSquareCords = currentDirection(
          activeSquareCords.x,
          activeSquareCords.y
        );

        activeSquare = customGrid[activeSquareCords.y]?.[activeSquareCords.x];

        if (activeSquare === "#") {
          currentDirectionIndex =
            currentDirectionIndex + 1 === directions.length
              ? 0
              : currentDirectionIndex + 1;
          currentDirection = directions[currentDirectionIndex];

          activeSquareCords = prevCoords;

          const directionShift = {
            x: activeSquareCords.x,
            y: activeSquareCords.y,
            direction: currentDirection,
          };

          if (
            directionsShifts.some((shift) => {
              return (
                shift.direction === directionShift.direction &&
                shift.x === directionShift.x &&
                shift.y === directionShift.y
              );
            })
          ) {
            isStuckCount += 1;
            activeSquare = undefined;
            return;
          }

          directionsShifts.push(directionShift);

          activeSquare = customGrid[activeSquareCords.y]?.[activeSquareCords.x];
          continue;
        }
        continue;
      }
      if (activeSquare === "#") {
        console.log("square hit");
        return;
      }
    }
  });

  return isStuckCount;
};

console.log(part1());
console.log(part2());
