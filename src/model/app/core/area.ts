import { Position } from "../impl/position";

export interface Area {
    /**
     * Return boolean true if the position is inside the area, otherwise false
     * @param position
     */
    isInside(position: Position): boolean;
}
  