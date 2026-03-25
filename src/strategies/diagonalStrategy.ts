import { Mower } from "../mower";
import { MowerStrategy } from "./mowerStrategy";

export class DiagonalStrategy implements MowerStrategy {
  move(mower: Mower): void {
    mower.moveForward();
    mower.turnRight();
    mower.moveForward();
    mower.turnLeft();
  }

  jump(mower: Mower): void {
    mower.moveForward();
    mower.moveForward();
    mower.turnRight();
    mower.moveForward();
    mower.moveForward();
    mower.turnLeft();
  }
}
