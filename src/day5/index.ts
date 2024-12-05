import { getInput } from "../utils/get-input.ts";

const input = getInput(import.meta.dirname, "./input.txt");

const getParsedInput = (input: string) => {
  const [pageOrderingRules, pagesToProduce] = input.split("\r\n\r\n");

  const parsedPageOrderingRules = pageOrderingRules
    .split("\r\n")
    .map((item) => item.split("|").map(Number));

  const parsedPagesToProduce = pagesToProduce
    .split("\r\n")
    .map((item) => item.split(",").map(Number));

  return [parsedPageOrderingRules, parsedPagesToProduce] as const;
};

type PagesStateResponse = {
  validPages: number[][];
  invalidPages: number[][];
};

const [pageOrderingRules, pagesToProduce] = getParsedInput(input);

const getPageOrderingRules = (update: number[], pageNum: number) => {
  const otherNumbersInUpdate = update.filter((num) => num !== pageNum);
  const filteredPageOrderingRules = pageOrderingRules.filter(
    (orderingRules) => {
      return (
        orderingRules.includes(pageNum) &&
        orderingRules.some((orderingRule) => {
          return otherNumbersInUpdate.includes(orderingRule);
        })
      );
    }
  );
  return filteredPageOrderingRules;
};

const getPagesState = () => {
  const pagesState = pagesToProduce.reduce<PagesStateResponse>(
    (acc, update) => {
      const isValid = update.every((pageNum, i) => {
        const filteredPageOrderingRules = getPageOrderingRules(update, pageNum);

        const pageNumsAfterCurrent = update.slice(i + 1);
        const pageNumsBeforeCurrent = update.slice(0, i);

        return filteredPageOrderingRules.every((orderingRule) => {
          const [leftPage, rightPage] = orderingRule;
          const isRuleForPageAfter = leftPage === pageNum;

          if (isRuleForPageAfter) {
            return pageNumsAfterCurrent.includes(rightPage);
          }

          return pageNumsBeforeCurrent.includes(leftPage);
        });
      });

      if (isValid) {
        acc.validPages.push(update);
      } else {
        acc.invalidPages.push(update);
      }

      return acc;
    },
    { validPages: [], invalidPages: [] } as PagesStateResponse
  );

  return pagesState;
};

const pagesState = getPagesState();

const addUpMiddlePages = (updates: number[][]) => {
  let total = 0;

  updates.forEach((update) => {
    const middleItem = update[Math.round((update.length - 1) / 2)];
    total += middleItem;
  });

  return total;
};

const part1 = () => {
  const validPagesToProduce = pagesState.validPages;

  return addUpMiddlePages(validPagesToProduce);
};

const parseRules = (rules: number[][]) => {
  const result: Record<number, Set<number>> = {};

  for (const rule of rules) {
    const [left, right] = rule;

    if (!result[left]) {
      result[left] = new Set();
    }

    result[left].add(right);
  }

  return result;
};

const part2 = () => {
  const invalidPagesToProduce = pagesState.invalidPages;

  const parsedRules = parseRules(pageOrderingRules);

  const convertedValidPages = invalidPagesToProduce.map((update) => {
    return update.toSorted((a, b) => {
      if (parsedRules[a].has(b)) return -1;
      if (parsedRules[b].has(a)) return 1;
      return 0;
    });
  });

  return addUpMiddlePages(convertedValidPages);
};

console.log(part1());
console.log(part2());
