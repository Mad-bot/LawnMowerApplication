import { Movable } from "../core/movable";
import { Position } from "./position";

export class Mower implements Movable {
  position: Position;
  // Constructor
  constructor(position: Position) {
    this.position = position;
  }
  /**
   * Move from a position to a new location
   * @param position
   */
  moveTo(position: Position): void {
    this.position = position;
  }
  /**
   * Returns the current position
   */
  getPosition(): Position {
    return this.position;
  }
}
