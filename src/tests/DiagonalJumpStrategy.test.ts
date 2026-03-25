import { DiagonalJumpStrategy } from "../../src/strategies/DiagonalJumpStrategy";
import { ILawnMower } from "../../src/interfaces/ILawnMower";

describe("DiagonalJumpStrategy", () => {
  let lawnMower: ILawnMower;
  let strategy: DiagonalJumpStrategy;

  beforeEach(() => {
    lawnMower = {
      getX: jest.fn().mockReturnValue(0),
      getY: jest.fn().mockReturnValue(0),
      setX: jest.fn(),
      setY: jest.fn(),
    } as unknown as ILawnMower;

    strategy = new DiagonalJumpStrategy();
  });

  it("should increment x and y by 1 when jump is called", () => {
    strategy.jump(lawnMower);

    expect(lawnMower.setX).toHaveBeenCalledWith(1);
    expect(lawnMower.setY).toHaveBeenCalledWith(1);
  });

  it("should move diagonally from a non-zero position", () => {
    (lawnMower.getX as jest.Mock).mockReturnValue(3);
    (lawnMower.getY as jest.Mock).mockReturnValue(5);

    strategy.jump(lawnMower);

    expect(lawnMower.setX).toHaveBeenCalledWith(4);
    expect(lawnMower.setY).toHaveBeenCalledWith(6);
  });

  it("should increment both x and y together (diagonal movement)", () => {
    (lawnMower.getX as jest.Mock).mockReturnValue(10);
    (lawnMower.getY as jest.Mock).mockReturnValue(20);

    strategy.jump(lawnMower);

    expect(lawnMower.setX).toHaveBeenCalledWith(11);
    expect(lawnMower.setY).toHaveBeenCalledWith(21);
  });
});
