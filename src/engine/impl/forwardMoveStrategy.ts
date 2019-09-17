import { Position } from "../../model/app/impl/position";
import { MoveStrategy } from "../core/moveStrategy";
import { Direction } from "../../model/enum/direction";

export class ForwardMoveStrategy implements MoveStrategy {
  /**
   * Move forward according to the direction
   *
   * @param {Position} position
   * @returns {Position}
   * @memberof ForwardMoveStrategy
   */
  move(position: Position): Position {
    let newPosition: Position;
    const direction = position.getDirection();
    switch(direction) {
      case Direction.NORTH :
        newPosition = new Position(position.getX(), position.getY() + 1, direction);
        break;
      case Direction.SOUTH :
        newPosition = new Position(position.getX(), position.getY() - 1, direction);
        break;
      case Direction.EAST :
        newPosition = new Position(position.getX() + 1, position.getY(), direction);
        break;
      case Direction.WEST :
        newPosition = new Position(position.getX() - 1, position.getY(), direction);
        break;
      default :
        throw new Error('Something bad happened with direction : ' + position.getDirection());
        break;
    }
    return newPosition;
  }

}
