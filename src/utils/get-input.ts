import fs from "fs";
import path from "path";

type fileNameOptions = "./input.txt" | "./input.example.txt";

export function getInput(
  dir: string,
  fileName: fileNameOptions = "./input.txt"
) {
  return fs.readFileSync(path.resolve(dir, fileName), {
    encoding: "utf-8",
  });
}
