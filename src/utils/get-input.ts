import fs from "fs";
import path from "path";

export function getInput(dir: string, fileName = "./input.txt") {
  return fs.readFileSync(path.resolve(dir, fileName), {
    encoding: "utf-8",
  });
}
