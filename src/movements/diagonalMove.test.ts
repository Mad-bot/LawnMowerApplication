import { Mower } from "../mower";
import { diagonalMove } from "./diagonalMove";

describe("diagonalMove", () => {
  let mower: Mower;

  beforeEach(() => {
    mower = new Mower(0, 0, "N");
  });

  it("should move diagonally in the positive X and positive Y direction", () => {
    diagonalMove(mower, 1, 1);
    expect(mower.x).toBe(1);
    expect(mower.y).toBe(1);
  });

  it("should move diagonally in the negative X and negative Y direction", () => {
    diagonalMove(mower, -1, -1);
    expect(mower.x).toBe(-1);
    expect(mower.y).toBe(-1);
  });

  it("should move diagonally in the positive X and negative Y direction", () => {
    diagonalMove(mower, 3, -2);
    expect(mower.x).toBe(3);
    expect(mower.y).toBe(-2);
  });

  it("should move diagonally in the negative X and positive Y direction", () => {
    diagonalMove(mower, -4, 5);
    expect(mower.x).toBe(-4);
    expect(mower.y).toBe(5);
  });

  it("should accumulate position across multiple diagonal moves", () => {
    diagonalMove(mower, 2, 3);
    diagonalMove(mower, -1, 1);
    expect(mower.x).toBe(1);
    expect(mower.y).toBe(4);
  });

  it("should not move when both deltas are zero", () => {
    diagonalMove(mower, 0, 0);
    expect(mower.x).toBe(0);
    expect(mower.y).toBe(0);
  });
});
