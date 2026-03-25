import { DiagonalMoveStrategy } from "../../src/strategies/DiagonalMoveStrategy";
import { Mower } from "../../src/Mower";
import { Direction } from "../../src/Direction";

// ---------------------------------------------------------------------------
// Helpers / mocks
// ---------------------------------------------------------------------------

function createMowerMock(direction: Direction = Direction.NORTH): jest.Mocked<Mower> {
  return {
    moveForward: jest.fn(),
    turnRight45: jest.fn(),
    turnLeft45: jest.fn(),
    getDirection: jest.fn().mockReturnValue(direction),
  } as unknown as jest.Mocked<Mower>;
}

// ---------------------------------------------------------------------------
// Constructor
// ---------------------------------------------------------------------------

describe("DiagonalMoveStrategy – constructor", () => {
  it("creates a strategy with a default stepsPerPass of 3", () => {
    expect(() => new DiagonalMoveStrategy()).not.toThrow();
  });

  it("creates a strategy with a custom stepsPerPass", () => {
    expect(() => new DiagonalMoveStrategy(5)).not.toThrow();
  });

  it("throws when stepsPerPass is less than 1", () => {
    expect(() => new DiagonalMoveStrategy(0)).toThrow(
      "stepsPerPass must be at least 1."
    );
  });
});

// ---------------------------------------------------------------------------
// execute()
// ---------------------------------------------------------------------------

describe("DiagonalMoveStrategy – execute()", () => {
  it("calls moveForward, turnRight45, moveForward, turnLeft45 for each step", () => {
    const stepsPerPass = 3;
    const strategy = new DiagonalMoveStrategy(stepsPerPass);
    const mower = createMowerMock();

    strategy.execute(mower);

    expect(mower.moveForward).toHaveBeenCalledTimes(stepsPerPass * 2);
    expect(mower.turnRight45).toHaveBeenCalledTimes(stepsPerPass);
    expect(mower.turnLeft45).toHaveBeenCalledTimes(stepsPerPass);
  });

  it("respects a custom stepsPerPass of 1", () => {
    const strategy = new DiagonalMoveStrategy(1);
    const mower = createMowerMock();

    strategy.execute(mower);

    expect(mower.moveForward).toHaveBeenCalledTimes(2);
    expect(mower.turnRight45).toHaveBeenCalledTimes(1);
    expect(mower.turnLeft45).toHaveBeenCalledTimes(1);
  });

  it("respects a custom stepsPerPass of 5", () => {
    const strategy = new DiagonalMoveStrategy(5);
    const mower = createMowerMock();

    strategy.execute(mower);

    expect(mower.moveForward).toHaveBeenCalledTimes(10);
    expect(mower.turnRight45).toHaveBeenCalledTimes(5);
    expect(mower.turnLeft45).toHaveBeenCalledTimes(5);
  });

  it("calls operations in the correct order for a single step", () => {
    const strategy = new DiagonalMoveStrategy(1);
    const mower = createMowerMock();
    const callOrder: string[] = [];

    mower.moveForward.mockImplementation(() => { callOrder.push("moveForward"); });
    mower.turnRight45.mockImplementation(() => { callOrder.push("turnRight45"); });
    mower.turnLeft45.mockImplementation(() => { callOrder.push("turnLeft45"); });

    strategy.execute(mower);

    expect(callOrder).toEqual([
      "moveForward",
      "turnRight45",
      "moveForward",
      "turnLeft45",
    ]);
  });
});

// ---------------------------------------------------------------------------
// buildMoveSequence()
// ---------------------------------------------------------------------------

describe("DiagonalMoveStrategy – buildMoveSequence()", () => {
  it("returns a sequence of length stepsPerPass * 2", () => {
    const stepsPerPass = 3;
    const strategy = new DiagonalMoveStrategy(stepsPerPass);
    const mower = createMowerMock(Direction.NORTH);

    const sequence = strategy.buildMoveSequence(mower);

    expect(sequence).toHaveLength(stepsPerPass * 2);
  });

  it("alternates between the original direction and its 45° right rotation (NORTH → NORTH_EAST)", () => {
    const strategy = new DiagonalMoveStrategy(2);
    const mower = createMowerMock(Direction.NORTH);

    const sequence = strategy.buildMoveSequence(mower);

    expect(sequence).toEqual([
      Direction.NORTH,
      Direction.NORTH_EAST,
      Direction.NORTH,
      Direction.NORTH_EAST,
    ]);
  });

  it("correctly rotates EAST 45° right to SOUTH_EAST", () => {
    const strategy = new DiagonalMoveStrategy(1);
    const mower = createMowerMock(Direction.EAST);

    const sequence = strategy.buildMoveSequence(mower);

    expect(sequence).toEqual([Direction.EAST, Direction.SOUTH_EAST]);
  });

  it("wraps around correctly: NORTH_WEST 45° right → NORTH", () => {
    const strategy = new DiagonalMoveStrategy(1);
    const mower = createMowerMock(Direction.NORTH_WEST);

    const sequence = strategy.buildMoveSequence(mower);

    expect(sequence).toEqual([Direction.NORTH_WEST, Direction.NORTH]);
  });
});
