import { IMoveStrategy } from "./IMoveStrategy";
import { Orientation } from "../models/Orientation";
import { IPosition } from "../models/IPosition";
import { ILawn } from "../models/ILawn";

export class Jump2MoveStrategy implements IMoveStrategy {
  readonly name = "Jump2";

  move(position: IPosition, orientation: Orientation, lawn: ILawn): IPosition {
    const step = 2;
    let newX = position.x;
    let newY = position.y;

    switch (orientation) {
      case Orientation.N:
        newY = position.y + step;
        break;
      case Orientation.E:
        newX = position.x + step;
        break;
      case Orientation.S:
        newY = position.y - step;
        break;
      case Orientation.W:
        newX = position.x - step;
        break;
    }

    // Clamp to lawn boundaries
    newX = Math.min(Math.max(newX, 0), lawn.width);
    newY = Math.min(Math.max(newY, 0), lawn.height);

    return { x: newX, y: newY };
  }
}
