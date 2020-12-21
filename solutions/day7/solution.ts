import { read, position } from "promise-path";
import { reportGenerator, ints } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

interface HashTable<T> {
  [key: string]: T;
}

const bagR = /^(\w* \w*) bags contain (.*)\.$/m;
const childrenR = /^(\d*) (\w* \w*) bags?,? ?(.*)$/m;

export async function run(day: string) {
  const input = (await read(fromHere("input.txt"), "utf8")).trim();
  const bagInput = input.split("\n").map((bag: string) => bag.match(bagR)!);
  // console.log(bagInput);
  await solveForFirstStar(bagInput);
  await solveForSecondStar(bagInput);
}

const parseBag = (inputBags: RegExpExecArray[]): HashTable<string[]> =>
  inputBags.reduce(
    (hashmap: HashTable<string[]>, bagInput: RegExpExecArray) => {
      let text = bagInput[2];
      let content = text.match(childrenR);
      const contains: string[] = [];

      while (content !== null) {
        for (let i = 0; i < +content[1]; i++) {
          contains.push(content[2]);
        }

        content = content[3].match(childrenR);
      }

      hashmap[bagInput[1]] = contains;
      return hashmap;
    },
    {} as HashTable<string[]>
  );

async function solveForFirstStar(input: RegExpExecArray[]) {
  let solution;
  const t0 = performance.now();
  const mybag = "shiny gold";
  let canHoldMyBag = new Set<string>();

  let needToCheck = [mybag];
  //stuff
  const bags = parseBag(input);
  const keys = Object.keys(bags);

  while (needToCheck.length > 0) {
    let bag = needToCheck.shift()!;
    keys.forEach((key) => {
      if (bags[key].includes(bag) && !canHoldMyBag.has(key)) {
        canHoldMyBag.add(key);
        needToCheck.push(key);
      }
    });
  }

  console.log(canHoldMyBag.size);

  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input: RegExpExecArray[]) {
  let solution;
  const t0 = performance.now();

  //stuff
  const mybag = "shiny gold";

  let needToCheck = [mybag];
  let checked: string[] = [];
  const bags = parseBag(input);
  // console.log(bags);
  while (needToCheck.length > 0) {
    let bag = needToCheck.shift()!;
    checked.push(bag);

    needToCheck.push(...bags[bag]);

    // break;
  }

  console.log(checked.length - 1);

  const t1 = performance.now();
  const ms = t1 - t0;

  report("Solution 2:", `${solution || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
