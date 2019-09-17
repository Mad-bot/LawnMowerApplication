import { Area } from "../../model/app/core/area";
import { Movable } from "../../model/app/core/movable";
import { Position } from "../../model/app/impl/position";
import { Move } from "../../model/enum/move";
import { MoveEngine } from "../core/moveEngine";
/**
 * Implementation of the move engine
 */
export declare class MoveEngineImpl implements MoveEngine {
    private movables;
    private area;
    addMovable(movable: Movable, position: Position): number;
    move(id: number, move: Move): Position;
    getMovableFromId(id: number): Movable;
    getMovables(): Movable[];
    setArea(area: Area): void;
}
