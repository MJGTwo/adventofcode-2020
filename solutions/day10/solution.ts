import { read, position } from "promise-path";
import { reportGenerator, ints, sum as summation } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

export async function run(day: string) {
  const input = (await read(fromHere("input.txt"), "utf8")).trim();

  await solveForFirstStar(ints(input));
  await solveForSecondStar(ints(input));
}

const tribonacciSequence: number[] = [1, 1, 2];

const getTribonacci = (num: number): number => {
  while (num > tribonacciSequence.length) {
    tribonacciSequence.push(
      summation(
        ...tribonacciSequence.slice(
          tribonacciSequence.length - 3,
          tribonacciSequence.length + 1
        )
      )
    );
  }

  return tribonacciSequence[num - 1];
};

const part2 = (adapters: number[]): number => {
  adapters.sort((x, y) => x - y);
  adapters.push(adapters[adapters.length - 1] + 3);
  adapters.unshift(0);

  let multiplier = 1;
  let currentRun = 1;

  for (let joltage of adapters) {
    if (adapters.includes(joltage + 1)) {
      currentRun++;
    } else {
      multiplier *= getTribonacci(currentRun);
      currentRun = 1;
    }
  }
  return multiplier;
};

async function solveForFirstStar(input: number[]) {
  let solution;
  const t0 = performance.now();
  const adapters = input.sort((a: number, b: number): number => a - b);

  const differences: { [index: number]: number } = { 1: 0, 2: 0, 3: 0 };
  adapters.forEach((value, index) => {
    const difference = adapters[index] - adapters[index - 1];
    differences[difference]++;
  });

  console.log(differences);
  //stuff

  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input: number[]) {
  let solution;
  const t0 = performance.now();

  //stuff
  const answer = part2(input);
  console.log(answer);

  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 2:", `${solution || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
