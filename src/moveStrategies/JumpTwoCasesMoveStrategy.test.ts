import { JumpTwoCasesMoveStrategy } from "../../src/moveStrategies/JumpTwoCasesMoveStrategy";
import { Mower } from "../../src/Mower";
import { Position } from "../../src/Position";
import { Orientation } from "../../src/Orientation";

describe("JumpTwoCasesMoveStrategy", () => {
  let strategy: JumpTwoCasesMoveStrategy;

  beforeEach(() => {
    strategy = new JumpTwoCasesMoveStrategy();
  });

  it("should move 2 cases forward when facing North", () => {
    const mower = new Mower(new Position(3, 3), Orientation.N);
    strategy.move(mower);
    expect(mower.getPosition().getX()).toBe(3);
    expect(mower.getPosition().getY()).toBe(5);
  });

  it("should move 2 cases forward when facing East", () => {
    const mower = new Mower(new Position(3, 3), Orientation.E);
    strategy.move(mower);
    expect(mower.getPosition().getX()).toBe(5);
    expect(mower.getPosition().getY()).toBe(3);
  });

  it("should move 2 cases forward when facing South", () => {
    const mower = new Mower(new Position(3, 3), Orientation.S);
    strategy.move(mower);
    expect(mower.getPosition().getX()).toBe(3);
    expect(mower.getPosition().getY()).toBe(1);
  });

  it("should move 2 cases forward when facing West", () => {
    const mower = new Mower(new Position(3, 3), Orientation.W);
    strategy.move(mower);
    expect(mower.getPosition().getX()).toBe(1);
    expect(mower.getPosition().getY()).toBe(3);
  });

  it("should not go beyond the lawn boundaries (North boundary)", () => {
    const mower = new Mower(new Position(3, 4), Orientation.N);
    strategy.move(mower);
    expect(mower.getPosition().getY()).toBeLessThanOrEqual(mower.getLawn().getHeight() - 1);
  });

  it("should not go beyond the lawn boundaries (South boundary)", () => {
    const mower = new Mower(new Position(3, 0), Orientation.S);
    strategy.move(mower);
    expect(mower.getPosition().getY()).toBeGreaterThanOrEqual(0);
  });

  it("should not go beyond the lawn boundaries (West boundary)", () => {
    const mower = new Mower(new Position(0, 3), Orientation.W);
    strategy.move(mower);
    expect(mower.getPosition().getX()).toBeGreaterThanOrEqual(0);
  });

  it("should not go beyond the lawn boundaries (East boundary)", () => {
    const mower = new Mower(new Position(4, 3), Orientation.E);
    strategy.move(mower);
    expect(mower.getPosition().getX()).toBeLessThanOrEqual(mower.getLawn().getWidth() - 1);
  });
});
