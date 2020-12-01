import path from "path";
import { read, write, position } from "promise-path";
const fromHere = position(__dirname);
export const reportGenerator = (filename: string) => async (
  ...messages: string[]
) =>
  console.log(
    `[${require(await fromHere("../package.json")).logName} / ${filename
      .split(path.sep)
      .pop()
      ?.split(".ts")
      .shift()}]`,
    ...messages
  );

export const replaceInFile = async (
  filename: string,
  search: string | RegExp,
  replace: string
): Promise<any> => {
  const haystack: string = await read(filename, "utf8");
  const ashes: string = haystack.replace(search, replace);
  return write(filename, ashes, "utf8");
};

export const range = (upperBound: number, lowerBound = 0): number[] =>
  [...Array(upperBound - lowerBound).keys()].map((i) => i + lowerBound);

export const ints = (str: string): number[] =>
  str.match(/-?\d+/g)!.map((value) => +value);

export const positiveInts = (str: string): number[] =>
  str.match(/\d+/g)!.map((value) => +value);

export const floats = (str: string): number[] =>
  str.match(/-?\d+(?:\.\d+)?/g)!.map((value) => +value);

export const positiveFloats = (str: string): number[] =>
  str.match(/\d+(?:\.\d+)?/g)!.map((value) => +value);

export const words = (str: string): string[] => str.match(/[a-zA-Z]+/g)!;

export const minMax = (...nums: number[]): [number, number] => [
  Math.min(...nums),
  Math.max(...nums),
];

export const maxMinusMin = (...nums: number[]): number =>
  Math.max(...nums) - Math.min(...nums);
