import { Position } from "../../model/app/impl/position";
import { Direction } from "../../model/enum/direction";
import { MoveStrategy } from "../core/moveStrategy";

export class ForwardNorthEastMoveStrategy implements MoveStrategy {
  public move(position: Position): Position {
    return new Position(position.getX() + 1, position.getY() + 1, Direction.NORTH_EAST);
  }
}
