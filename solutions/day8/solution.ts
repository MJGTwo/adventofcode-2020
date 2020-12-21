import { read, position } from "promise-path";
import { reportGenerator, ints } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

const operationsR = /^(\w*) (\+\d*|-\d*)$/m;

interface Instruction {
  action: string;
  value: number;
  timesVisited: number;
}

interface InstructionSet {
  [position: number]: Instruction;
  index: number;
  acc: number;
  finished: boolean;
}

export async function run(day: string) {
  const input: string = (await read(fromHere("input.txt"), "utf8")).trim();
  const instructions: Instruction[] = input
    .split("\n")
    .map((step) => step.match(operationsR)!)
    .map((step) => ({ action: step[1], value: +step[2], timesVisited: 0 }));

  await solveForFirstStar(JSON.parse(JSON.stringify(instructions)));
  await solveForSecondStar(JSON.parse(JSON.stringify(instructions)));
}

const start = (instructions: InstructionSet) => {
  let index = 0;
  while (
    Object.keys(instructions).includes(`${instructions.index}`) &&
    instructions[index].timesVisited === 0
  ) {
    instructions[index].timesVisited++;
    index = instructions.index;
    const instruction = instructions[index];

    if (instruction.action === "nop") {
      index++;
    } else if (instruction.action === "acc") {
      instructions.acc += instruction.value;
      index++;
    } else if (instruction.action === "jmp") {
      if (instruction.value === 0) {
        break;
      }
      index += instruction.value;
    }
    instructions.index = index;
  }
  if (!Object.keys(instructions).includes(`${instructions.index}`)) {
    instructions.finished = true;
  }
  return instructions;
};

const fix = (instructions: InstructionSet) => {
  const keys = Object.keys(instructions);
  let index = 0;
  // console.log(keys);
  while (keys.includes(`${index}`)) {
    // console.log(index);
    const copy: InstructionSet = JSON.parse(JSON.stringify(instructions));
    if (instructions[index].action === "nop") {
      copy[index].action = "jmp";
    } else if (instructions[index].action === "jmp") {
      copy[index].action = "nop";
    } else {
      index++;
      continue;
    }

    start(copy);

    if (copy.finished) {
      console.log("HERE");
      console.log(copy);
      break;
    }
    index++;
  }
};

async function solveForFirstStar(input: Instruction[]) {
  let solution;
  const t0 = performance.now();
  const instructionSet: InstructionSet = { index: 0, acc: 0, finished: false };
  input.forEach((value, index) => (instructionSet[index] = value));
  //stuff

  // console.log(instructionSet);
  start(instructionSet);
  console.log(instructionSet);
  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input) {
  let solution;
  const t0 = performance.now();

  const instructionSet: InstructionSet = { index: 0, acc: 0, finished: false };
  input.forEach((value, index) => (instructionSet[index] = value));
  //stuff

  fix(instructionSet);
  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 2:", `${solution || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
