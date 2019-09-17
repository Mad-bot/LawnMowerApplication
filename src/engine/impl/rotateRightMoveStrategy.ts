import { Position } from "../../model/app/impl/position";
import { Direction } from "../../model/enum/direction";
import { MoveStrategy } from "../core/moveStrategy";

/**
 * Right move strategy of rotation
 *
 * @class RotateRightMoveStrategy
 * @implements {MoveStrategy}
 */
export class RotateRightMoveStrategy implements MoveStrategy {
  /**
   * Impl : Compute a new position
   * @param position
   */
  public move(position: Position): Position {
    const direction = position.getDirection();
    let newDirection: Direction;
    switch(direction) {
      case Direction.NORTH :
        newDirection = Direction.EAST;
        break;
      case Direction.SOUTH :
        newDirection = Direction.WEST;
        break;
      case Direction.EAST :
        newDirection = Direction.SOUTH;
        break;
      case Direction.WEST :
        newDirection = Direction.NORTH;
        break;
      default :
        throw new Error('Something bad happened with direction : ' + direction);
    }
    // Returns position with the new direction
    return new Position(position.getX(), position.getY(), newDirection);
  }
}
