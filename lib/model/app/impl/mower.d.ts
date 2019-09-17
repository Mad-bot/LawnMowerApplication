import { Movable } from "../core/movable";
import { Position } from "./position";
export declare class Mower implements Movable {
    private position;
    constructor(position: Position);
    /**
     * Move from a position to a new location
     * @param position
     */
    moveTo(position: Position): void;
    /**
     * Returns the current position
     */
    getPosition(): Position;
}
