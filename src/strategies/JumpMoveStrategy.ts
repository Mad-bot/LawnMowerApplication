import { IMoveStrategy } from "./IMoveStrategy";
import { Mower } from "../Mower";

export class JumpMoveStrategy implements IMoveStrategy {
  move(mower: Mower): void {
    mower.position.x += mower.direction.x * 2;
    mower.position.y += mower.direction.y * 2;
  }
}
