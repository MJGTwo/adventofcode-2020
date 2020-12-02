import { read, position } from "promise-path";
import { reportGenerator, mergeSort, ints } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

export async function run(day: string) {
  const input = ints((await read(fromHere("input.txt"), "utf8")).trim());

  await solveForFirstStar(input);
  await solveForSecondStar(input);
}

const twoNumSum = (values: number[], numbers: {}): number =>
  values.reduce(
    (product, current) =>
      numbers[2020 - current] ? current * (2020 - current) : product,
    -1
  );

const threeNumSum = (values: number[], numbers: {}, answer: number[]) =>
  values.every((value) =>
    values.reduce((product: boolean, current: number): boolean => {
      if (numbers[2020 - current - value]) {
        answer.push(current * (2020 - current - value) * value);
        return false;
      } else {
        return product;
      }
    }, true)
  );

async function solveForFirstStar(input: number[]) {
  const t0 = performance.now();

  let solution;
  const numbers = {};
  input.forEach((value) => (numbers[value] = true));

  solution = twoNumSum(input, numbers);

  const t1 = performance.now();
  const ms = t1 - t0;

  report("Input:", `${input}`);
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input) {
  let solution;
  const t0 = performance.now();
  const numbers = {};
  input.forEach((value) => (numbers[value] = true));
  const answer = [];
  solution = threeNumSum(input, numbers, answer);
  const t1 = performance.now();
  const ms = t1 - t0;
  report("Solution 2:", `${answer || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
