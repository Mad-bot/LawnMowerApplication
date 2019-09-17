import { Position } from "../../model/app/impl/position";
import { Movable } from "../../model/app/core/movable";
import { Area } from "../../model/app/core/area";
import { Move } from "../../model/enum/move";
export interface MoveEngine {
    /**
     * Add a movable to a position and registry an id to move it later
     * @param movable
     * @param position
     * @returns Generate a specific id
     */
    addMovable(movable: Movable, position: Position): number;
    /**
     * Move an element from an id and a move strategy
     * @param id
     * @param move
     */
    move(id: number, move: Move): Position;
    /**
     * Getter : return all the movables of the engine
     */
    getMovables(): Array<Movable>;
    /**
     * Sets the area where movables can move
     * @param area
     */
    setArea(area: Area): void;
}
