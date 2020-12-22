import { read, position } from "promise-path";
import { reportGenerator, ints } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

export async function run(day: string) {
  const input = (await read(fromHere("input.txt"), "utf8")).trim();

  await solveForFirstStar(input);
  await solveForSecondStar(input);
}

async function solveForFirstStar(input) {
  let solution;
  const t0 = performance.now();

  //stuff

  const t1 = performance.now();
  const ms = t1 - t0;
  report("Input:", `${input}`);
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input) {
  let solution;
  const t0 = performance.now();

  //stuff

  const t1 = performance.now();
  const ms = t1 - t0;
  report("Input:", `${input}`);
  report("Solution 2:", `${solution || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
