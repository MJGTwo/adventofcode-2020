import { read, position } from "promise-path";
import { reportGenerator, ints, sum as summation, minMax } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

const PREAMBLE_SIZE = 25;

const twoExists = (
  preamble: number[],
  possibleCompliment: Set<number>
): Set<number> => new Set(preamble.filter(possibleCompliment.has));

const findWrongValue = (values: number[], preambleSze = PREAMBLE_SIZE) =>
  values
    .reduce((testSets: number[][], value: number, currentIndex: number) => {
      if (currentIndex + preambleSze < values.length) {
        testSets.push(
          values.slice(currentIndex, currentIndex + preambleSze + 1)
        );
      }
      return testSets;
    }, [])
    .map((testcase: number[]) => {
      let passes = false;
      const copy = [...testcase];
      const sum = copy.pop();
      for (let i = 0; i < copy.length; i++) {
        for (let j = i + 1; j < copy.length; j++) {
          if (copy[i] + copy[j] === sum) {
            passes = true;
          }
        }
      }
      if (passes) {
        return -1;
      } else {
        return sum;
      }
    })
    .reduce((answer, value) => (value !== -1 ? value : answer));

const findrange = (
  values: number[],
  sum: number,
  preambleSze = PREAMBLE_SIZE
) => {
  let range = 2;
  while (range <= values.length) {
    for (let i = 0; i + range <= values.length; i++) {
      const set = values.slice(i, i + range);
      if (summation(...set) === sum) {
        return minMax(...set);
      }
    }
    range++;
  }
  return [];
};

export async function run(day: string) {
  const input = (await read(fromHere("input.txt"), "utf8")).trim();

  await solveForFirstStar(ints(input));
  await solveForSecondStar(ints(input));
}

async function solveForFirstStar(input: number[]) {
  let solution;
  const t0 = performance.now();
  let index = 0;

  //stuff
  const result = findWrongValue(input, PREAMBLE_SIZE);

  const t1 = performance.now();
  const ms = t1 - t0;
  // console.log(input);
  console.log(result);
  // report("Input:", `${input}`);
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input: number[]) {
  let solution;
  const t0 = performance.now();

  //stuff
  let index = 0;

  //stuff
  const sum = findWrongValue(input, PREAMBLE_SIZE)!;
  const result = findrange(input, sum, PREAMBLE_SIZE);
  console.log(result);
  console.log(summation(...result));
  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 2:", `${solution || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
