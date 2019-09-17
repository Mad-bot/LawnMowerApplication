import { Area } from "../../model/app/core/area";
import { Movable } from "../../model/app/core/movable";
import { Position } from "../../model/app/impl/position";
import { Move } from "../../model/enum/move";
import { MoveEngine } from "../core/moveEngine";
import { MoveStrategy } from "../core/moveStrategy";
import { ForwardMoveStrategy } from "./forwardMoveStrategy";
import { RotateLeftMoveStrategy } from "./rotateLeftMoveStrategy";
import { RotateRightMoveStrategy } from "./rotateRightMoveStrategy";

/**
 * Implementation of the move engine
 */
export class MoveEngineImpl implements MoveEngine {
  private movables: Movable[] = [];
  private area: Area | undefined;

  public addMovable(movable: Movable, position: Position): number {
    if(!this.area) {
      throw new Error('Something bad happened : area does not exist');
    } else if (!this.area.isInside(position)) {
      throw new Error('Something bad happened : element is out of area');
    } else {
      // Register the element in the engine
      this.movables.push(movable);
      const index = this.movables.indexOf(movable);
      movable.moveTo(position);
      return index;
    }
  }

  public move(id: number, move: Move): Position {
    // Get the strategy move from move
    let strategy: MoveStrategy;
    switch (move) {
      case Move.LEFT :
        strategy = new RotateLeftMoveStrategy();
        break;
      case Move.RIGHT :
        strategy = new RotateRightMoveStrategy();
        break;
      case Move.FORWARD :
        strategy = new ForwardMoveStrategy();
        break;
      default:
        throw new Error('Something bad happened : move ' + move + ' is not supported');
    }
    // Get the movable from id
    const movable: Movable = this.movables[id];
    if (!movable) {
      throw new Error('Something bad happened : id ' + id + ' does not exist');
    }
    // Get old and new positions
    const oldPosition: Position = movable.getPosition();
    const newPosition: Position = strategy.move(oldPosition);

    // Check if the new position is valid
    if(!this.area) {
      throw new Error('Something bad happened : area does not exist');
    } else if (this.area.isInside(newPosition) ) {
      // Move
      movable.moveTo(newPosition);
      return newPosition;
    } else {
      // Do nothing
      return oldPosition;
    }
  }

  public getMovableFromId(id: number): Movable {
    return this.movables[id];
  }

  public getMovables(): Movable[] {
    return this.movables;
  }

  public setArea(area: Area): void {
    this.area = area;
  }
}
