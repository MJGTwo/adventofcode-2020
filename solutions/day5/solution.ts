import { read, position } from "promise-path";
import { reportGenerator, ints } from "../util";
import { performance } from "perf_hooks";

const report = reportGenerator(__filename);
const fromHere = position(__dirname);

interface Seat {
  ticket: string;
  row?: number;
  column?: number;
  id?: number;
}

const seats = (input: string): Seat[] =>
  input.match(/[a-zA-Z]{10}/g)!.map((seat: string) => ({ ticket: seat }));

const findSeat = (seat: Seat): Seat => {
  const binary: number[] = seat.ticket
    .split("")
    .map((step: string) => (step === "F" || step === "L" ? 0 : 1));
  const row = binary.slice(0, 7);
  const column = binary.slice(7, 10);

  seat.row = row.reduce(
    (r, value) =>
      value === 0
        ? [r[0], (r[0] + r[1] + 1) / 2 - 1]
        : [(r[0] + r[1] + 1) / 2, r[1]],
    [0, 127]
  )[0];
  seat.column = column.reduce(
    (c, value) =>
      value === 0
        ? [c[0], (c[0] + c[1] + 1) / 2 - 1]
        : [(c[0] + c[1] + 1) / 2, c[1]],
    [0, 7]
  )[1];
  seat.id = seat.row * 8 + seat.column;
  return seat;
};

const sortSeat = (a: Seat, b: Seat): number => a.id! - b.id!;

export async function run(day: string) {
  const input = (await read(fromHere("input.txt"), "utf8")).trim();

  await solveForFirstStar(seats(input));
  await solveForSecondStar(seats(input));
}

async function solveForFirstStar(input) {
  let solution;
  const t0 = performance.now();

  //stuff
  const seats: Seat[] = input.map(findSeat);
  solution = seats.reduce(
    (max: number, seat: Seat) => (max < seat.id! ? seat.id! : max),
    -1
  );
  // console.log(seats);
  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${seats}`);
  report("Solution 1:", `${solution || "UNSOLVED"}`);
  report("S1 Time (ms): ", `${ms}`);
}

async function solveForSecondStar(input) {
  let solution;
  const t0 = performance.now();

  //stuff
  const seats: Seat[] = input.map(findSeat);
  seats.sort(sortSeat);

  for (var i = 0; i < seats.length - 1; i++) {
    const first = seats[i];
    const second = seats[i + 1];
    const missingID = seats[i].id! + 1;

    if (
      second.id! - first.id! === 2 &&
      seats.findIndex((seat) => seat.id === missingID) === -1
    ) {
      console.log(second.id!, first.id!);
      console.log("Missing seat is:", missingID);
    }
  }
  // console.log(seats);
  const t1 = performance.now();
  const ms = t1 - t0;
  // report("Input:", `${input}`);
  report("Solution 2:", `${solution || "UNSOLVED"}`);
  report("S2 Time (ms): ", `${ms}`);
}
