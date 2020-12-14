import { read, position } from "promise-path";
import { reportGenerator, ints } from "../util";
import { performance } from "perf_hooks";
import { create } from "domain";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

interface PassportRaw {
  byr: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
  cid: string;
}

interface Passport {
  byr: number;
  iyr: number;
  eyr: number;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
  cid: string;
}

export async function run(day: string) {
  const input = (await read(fromHere("input.txt"), "utf8")).trim();

  await solveForFirstStar(input.split("\n\n"));
  await solveForSecondStar(input.split("\n\n"));
}

const makePassports = (input: string[]): PassportRaw[] => {
  let validPassports: PassportRaw[] = [];

  for (let i = 0; i < input.length; i++) {
    let obj: Partial<PassportRaw> = {};
    const passport = input[i].split(/\s+/);
    passport.forEach((field) => {
      const info = field.split(":");
      obj[info[0]] = info[1];
    });
    validPassports.push(obj as PassportRaw);
  }

  return validPassports;
};

const isvalid = (passport: PassportRaw): boolean =>
  "byr" in passport &&
  "iyr" in passport &&
  "eyr" in passport &&
  "hgt" in passport &&
  "hcl" in passport &&
  "ecl" in passport &&
  "pid" in passport
    ? true
    : false;

const checkPassport = (passport: PassportRaw): number => {
  try {
    let passing = true;
    const birthYear = +passport.byr;
    if (birthYear < 1920 || birthYear > 2002) {
      passing = false;
    }

    const issueYear = +passport.iyr;
    if (issueYear < 2010 || issueYear > 2020) {
      passing = false;
    }

    const expirationYear = +passport.eyr;
    if (expirationYear < 2020 || expirationYear > 2030) {
      passing = false;
    }

    const height = passport.hgt;
    const unit = height.substring(height.length - 2);
    const measure = +height.substring(0, height.length - 2);

    if (unit === "cm") {
      if (measure < 150 || measure > 193) {
        passing = false;
      }
    } else if (unit === "in") {
      if (measure < 59 || measure > 76) {
        passing = false;
      }
    } else {
      passing = false;
    }

    const hair = passport.hcl;
    if (hair.length !== 7 || !/#[0-9a-fA-F]{6}/.test(hair)) {
      passing = false;
    }

    const eye = passport.ecl;
    if (!["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(eye)) {
      passing = false;
    }

    const passportID = passport.pid;
    if (passportID.length !== 9 || !/[0-9]{9}/.test(passportID)) {
      passing = false;
    }

    if (passing) {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
};

async function solveForFirstStar(input: string[]) {
  let solution;
  const t0 = performance.now();

  //stuff

  const passports = makePassports(input);
  const validPassports = passports.reduce(
    (total: number, passport: PassportRaw) =>
      total + (isvalid(passport) ? 1 : 0),
    0
  );
  const t1 = performance.now();
  const ms = t1 - t0;
  report("Input:", ``);
  report("Solution 1:", `${validPassports || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input: string[]) {
  let solution;
  const t0 = performance.now();

  const passports = makePassports(input);
  const validPassports = passports
    .filter(isvalid)
    .reduce(
      (total: number, passport: PassportRaw) => total + checkPassport(passport),
      0
    );

  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 2:", `${validPassports || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
