import { IMoveStrategy } from "./IMoveStrategy";
import { Mower } from "../Mower";
import { Orientation } from "../Orientation";
import { Position } from "../Position";

export class JumpTwoCasesMoveStrategy implements IMoveStrategy {
  move(mower: Mower): void {
    const position: Position = mower.getPosition();
    const orientation: Orientation = mower.getOrientation();

    let newX: number = position.getX();
    let newY: number = position.getY();

    switch (orientation) {
      case Orientation.N:
        newY += 2;
        break;
      case Orientation.E:
        newX += 2;
        break;
      case Orientation.S:
        newY -= 2;
        break;
      case Orientation.W:
        newX -= 2;
        break;
    }

    const lawn = mower.getLawn();
    const maxX: number = lawn.getWidth() - 1;
    const maxY: number = lawn.getHeight() - 1;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    mower.setPosition(new Position(newX, newY));
  }
}
