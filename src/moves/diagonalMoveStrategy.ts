import { MoveStrategy } from "./moveStrategy";
import { Mower } from "../mower";
import { Position } from "../position";
import { Orientation } from "../orientation";

export class DiagonalMoveStrategy implements MoveStrategy {
  move(mower: Mower): void {
    const position: Position = mower.getPosition();
    const orientation: Orientation = mower.getOrientation();

    let newX = position.x;
    let newY = position.y;

    switch (orientation) {
      case Orientation.NORTH:
        newX += 1;
        newY += 1;
        break;
      case Orientation.EAST:
        newX += 1;
        newY -= 1;
        break;
      case Orientation.SOUTH:
        newX -= 1;
        newY -= 1;
        break;
      case Orientation.WEST:
        newX -= 1;
        newY += 1;
        break;
    }

    mower.setPosition(new Position(newX, newY));
  }
}
