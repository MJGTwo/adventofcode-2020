import { read, position } from "promise-path";
import { reportGenerator, ints } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

const groups = (input: string): string[] => input.split("\n\n");
const individual = (group: string): string[] => group.split("\n");

const removeDuplicateCharacters = (str: string): string =>
  str
    .split("")
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })
    .join("");

const intersection = (a: string, b: string): string => {
  const bSet = new Set(b.split(""));
  const intersection = new Set([...a].filter((x) => bSet.has(x)));
  return [...intersection].join("");
};

export async function run(day: string) {
  const input = (await read(fromHere("input.txt"), "utf8")).trim();

  await solveForFirstStar(groups(input));
  await solveForSecondStar(groups(input));
}

async function solveForFirstStar(input: string[]) {
  let solution;
  const t0 = performance.now();

  //stuff
  const everyone = input
    .map(individual)
    .map((group: string[]) =>
      group
        .reduce(
          (total: string, answer: string) =>
            removeDuplicateCharacters(total + answer),
          ""
        )
        .split("")
        .sort()
        .join("")
    )
    .reduce((total: number, group: string) => total + group.length, 0);

  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 1:", `${everyone || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input: string[]) {
  let solution;
  const t0 = performance.now();

  //stuff
  const everyone = input
    .map(individual)
    .map((group: string[]) =>
      group
        .reduce((current: string, next: string) => intersection(current, next))
        .split("")
        .sort()
        .join("")
    )
    .reduce((total: number, group: string) => total + group.length, 0);

  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 2:", `${everyone || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
