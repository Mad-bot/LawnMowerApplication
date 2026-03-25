import { LawnMower } from "../LawnMower";
import { MoveStrategy } from "./MoveStrategy";

export class JumpStrategy implements MoveStrategy {
  move(lawnMower: LawnMower): void {
    const position = lawnMower.getPosition();
    lawnMower.setPosition({ x: position.x, y: position.y + 2 });
  }
}
