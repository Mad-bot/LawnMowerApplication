import { Position } from "../../model/app/impl/position";
import { Direction } from "../../model/enum/direction";
import { MoveStrategy } from "../core/moveStrategy";

/**
 * Left move strategy of rotation
 *
 * @class RotateLeftMoveStrategy
 * @implements {MoveStrategy}
 */
export class RotateLeftMoveStrategy implements MoveStrategy {
  /**
   * Impl : Compute a new position
   * @param position
   */
  public move(position: Position): Position {
    const direction = position.getDirection();
    let newDirection: Direction;
    switch(direction) {
      case Direction.NORTH :
        newDirection = Direction.WEST;
        break;
      case Direction.SOUTH :
        newDirection = Direction.EAST;
        break;
      case Direction.EAST :
        newDirection = Direction.NORTH;
        break;
      case Direction.WEST :
        newDirection = Direction.SOUTH;
        break;
      default :
        throw new Error('Something bad happened with direction : ' + direction);
    }

    // Returns position with the new direction
    return new Position(position.getX(), position.getY(), newDirection);
  }
}
