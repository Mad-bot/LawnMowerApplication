import { Position } from "../../model/app/impl/position";
import { Direction } from "../../model/enum/direction";
import { MoveStrategy } from "../core/moveStrategy";

export class ForwardSouthEastMoveStrategy implements MoveStrategy {
  public move(position: Position): Position {
    return new Position(position.getX() + 1, position.getY() - 1, Direction.SOUTH_EAST);
  }
}
