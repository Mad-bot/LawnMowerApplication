import { Position } from "../impl/position";

export interface Movable {
    /**
     * Move to a new position
     * @param position
     */
    moveTo(position: Position): void;
  
    getPosition(): Position;
  }
  