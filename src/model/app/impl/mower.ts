import { Movable } from "../core/movable";
import { Position } from "./position";

export class Mower implements Movable {
  private position: Position;
  // Constructor
  constructor(position: Position) {
    this.position = position;
  }
  /**
   * Move from a position to a new location
   * @param position
   */
  public moveTo(position: Position): void {
    this.position = position;
  }
  /**
   * Returns the current position
   */
  public getPosition(): Position {
    return this.position;
  }
}
