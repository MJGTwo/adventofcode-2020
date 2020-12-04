import { read, position } from "promise-path";
import { reportGenerator, ints, sum } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

export async function run(day: string) {
  const input = (await read(fromHere("input.txt"), "utf8")).trim();
  const table = parser(input);
  await solveForFirstStar(table);
  await solveForSecondStar(input);
}

const parser = (input: string): string[][] =>
  input
    .split("\n")
    .map((line) => line.repeat(35))
    .map((line) => line.split(""));

const travseHill = (
  { dy, dx }: { dy: number; dx: number },
  input: string[][]
) => {
  let y = 0;
  let x = 0;
  let treeCount = 0;
  while (y < input.length) {
    // console.log(input[y][x], y, x);
    if (input[y][x] === "#") {
      treeCount++;
    }
    y += dy;
    x += dx;
  }
  return treeCount;
};

async function solveForFirstStar(input) {
  let solution;
  const t0 = performance.now();

  const treeCount = travseHill({ dx: 3, dy: 1 }, input);
  const t1 = performance.now();
  const ms = t1 - t0;

  console.log("tree", treeCount);
  // report("Input:", `${input}`);
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input) {
  let solution;
  const t0 = performance.now();
  const parser2 = (input: string): string[][] =>
    input
      .split("\n")
      .map((line) => line.repeat(150))
      .map((line) => line.split(""));

  const slopes = [
    { dx: 1, dy: 1 },
    { dx: 3, dy: 1 },
    { dx: 5, dy: 1 },
    { dx: 7, dy: 1 },
    { dx: 1, dy: 2 },
  ];
  const input2 = parser2(input);
  // console.log(input2);
  solution = slopes
    .map((slope) => travseHill(slope, input2))
    .reduce((prod, curr) => prod * curr, 1);

  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 2:", `${solution || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
