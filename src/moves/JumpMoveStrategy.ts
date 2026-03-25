import { IMoveStrategy } from "./IMoveStrategy";
import { Mower } from "../Mower";

export class JumpMoveStrategy implements IMoveStrategy {
  move(mower: Mower): void {
    switch (mower.direction) {
      case "N":
        mower.y += 2;
        break;
      case "S":
        mower.y -= 2;
        break;
      case "E":
        mower.x += 2;
        break;
      case "W":
        mower.x -= 2;
        break;
    }
  }
}
