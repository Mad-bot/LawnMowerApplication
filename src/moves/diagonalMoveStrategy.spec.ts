import { DiagonalMoveStrategy } from "./diagonalMoveStrategy";
import { Mower } from "../mower";
import { Position } from "../position";
import { Orientation } from "../orientation";

describe("DiagonalMoveStrategy", () => {
  let strategy: DiagonalMoveStrategy;

  beforeEach(() => {
    strategy = new DiagonalMoveStrategy();
  });

  it("should move diagonally north-east when orientation is NORTH", () => {
    const mower = new Mower(new Position(2, 2), Orientation.NORTH);
    strategy.move(mower);
    expect(mower.getPosition()).toEqual(new Position(3, 3));
  });

  it("should move diagonally south-east when orientation is EAST", () => {
    const mower = new Mower(new Position(2, 2), Orientation.EAST);
    strategy.move(mower);
    expect(mower.getPosition()).toEqual(new Position(3, 1));
  });

  it("should move diagonally south-west when orientation is SOUTH", () => {
    const mower = new Mower(new Position(2, 2), Orientation.SOUTH);
    strategy.move(mower);
    expect(mower.getPosition()).toEqual(new Position(1, 1));
  });

  it("should move diagonally north-west when orientation is WEST", () => {
    const mower = new Mower(new Position(2, 2), Orientation.WEST);
    strategy.move(mower);
    expect(mower.getPosition()).toEqual(new Position(1, 3));
  });
});
