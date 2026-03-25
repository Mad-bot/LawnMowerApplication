import { Mower } from "../mower";
import { jumpMove } from "./jumpMove";

describe("jumpMove", () => {
  let mower: Mower;

  beforeEach(() => {
    mower = new Mower(0, 0, "N");
  });

  it("should jump to a positive coordinate", () => {
    jumpMove(mower, 5, 3);
    expect(mower.x).toBe(5);
    expect(mower.y).toBe(3);
  });

  it("should jump to a negative coordinate", () => {
    jumpMove(mower, -4, -7);
    expect(mower.x).toBe(-4);
    expect(mower.y).toBe(-7);
  });

  it("should jump to the origin", () => {
    mower = new Mower(10, 10, "S");
    jumpMove(mower, 0, 0);
    expect(mower.x).toBe(0);
    expect(mower.y).toBe(0);
  });

  it("should override the current position regardless of starting point", () => {
    mower = new Mower(3, 7, "E");
    jumpMove(mower, 1, 2);
    expect(mower.x).toBe(1);
    expect(mower.y).toBe(2);
  });

  it("should jump multiple times and always land on the last target", () => {
    jumpMove(mower, 10, 20);
    jumpMove(mower, -3, 5);
    expect(mower.x).toBe(-3);
    expect(mower.y).toBe(5);
  });

  it("should not move when jumping to the current position", () => {
    mower = new Mower(4, 4, "W");
    jumpMove(mower, 4, 4);
    expect(mower.x).toBe(4);
    expect(mower.y).toBe(4);
  });
});
