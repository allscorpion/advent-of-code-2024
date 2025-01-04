import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.txt");

const getParsedInput = (input: string): number[][] => {
  const rows = input
    .trim()
    .split("\r\n")
    .map((row) => row.split("").map(Number));

  return rows;
};

const getTrailheadScores = (map: number[][]) => {
  const rows = map.length;
  const cols = map[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const bfs = (startRow: number, startCol: number) => {
    const queue = [[startRow, startCol, 0]];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[startRow][startCol] = true;
    let score = 0;

    while (queue.length > 0) {
      const [row, col, height] = queue.shift()!;

      if (map[row][col] === 9) {
        score++;
        continue;
      }

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          !visited[newRow][newCol] &&
          map[newRow][newCol] === height + 1
        ) {
          visited[newRow][newCol] = true;
          queue.push([newRow, newCol, height + 1]);
        }
      }
    }

    return score;
  };

  let totalScore = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (map[row][col] === 0) {
        totalScore += bfs(row, col);
      }
    }
  }

  return totalScore;
};

const getTrailheadRatings = (map: number[][]) => {
  const rows = map.length;
  const cols = map[0].length;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  const dfs = (row: number, col: number, height: number) => {
    if (map[row][col] === 9) {
      return 1;
    }

    let rating = 0;
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        map[newRow][newCol] === height + 1
      ) {
        rating += dfs(newRow, newCol, height + 1);
      }
    }

    return rating;
  };

  let totalRating = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (map[row][col] === 0) {
        totalRating += dfs(row, col, 0);
      }
    }
  }

  return totalRating;
};

const part1 = () => {
  const parsedInput = getParsedInput(input);
  return getTrailheadScores(parsedInput);
};

const part2 = () => {
  const parsedInput = getParsedInput(input);
  return getTrailheadRatings(parsedInput);
};

console.log(part1());
console.log(part2());
