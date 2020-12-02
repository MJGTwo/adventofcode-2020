import { read, position } from "promise-path";
import { reportGenerator } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

interface Password {
  min: number;
  max: number;
  password: boolean[];
}

export async function run(day: string) {
  const rawinput = await read(fromHere("input.txt"), "utf8");
  const input: Password[] = parser(rawinput);

  await solveForFirstStar(input);
  await solveForSecondStar(input);
}

//parser
const parser = (input: string) =>
  input
    .split("\n")
    .map(parseLine)
    .map(
      ([, min, max, letter, password]) =>
        ({
          min: +min,
          max: +max,
          password: password.split("").map((char) => char === letter),
        } as Password)
    );
const parseLine = (input: string): RegExpExecArray =>
  /(\d+)-(\d+) ([a-z]): ([a-z]+)/g.exec(input)!;

async function solveForFirstStar(input: Password[]) {
  let solution;
  const t0 = performance.now();

  solution = input
    .map(({ password, min, max }) => ({
      min,
      max,
      number: password.filter((char) => char).length,
    }))
    .reduce(
      (count, { min, max, number }) =>
        number >= min && number <= max ? count + 1 : count,
      0
    );

  const t1 = performance.now();
  const ms = t1 - t0;
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input: Password[]) {
  let solution;
  const t0 = performance.now();

  solution = input
    .map(({ min, max, password }) => ({
      first: password[min - 1],
      second: password[max - 1],
    }))
    .reduce(
      (count, { first, second }) =>
        (first && !second) || (!first && second) ? count + 1 : count,
      0
    );
  const t1 = performance.now();
  const ms = t1 - t0;
  report("Solution 2:", `${solution || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
